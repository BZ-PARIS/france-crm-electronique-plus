import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create client for user authentication
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get request body
    const { plan_id } = await req.json();
    if (!plan_id) throw new Error("plan_id is required");
    logStep("Plan requested", { plan_id });

    // Get user's organization
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from("organization_members")
      .select("organization_id, role")
      .eq("user_id", user.id)
      .single();

    if (memberError || !memberData) {
      throw new Error("User is not a member of any organization");
    }

    const organizationId = memberData.organization_id;
    logStep("Found user organization", { organizationId, role: memberData.role });

    // Check if user can manage subscriptions (admin or owner)
    if (!["admin", "owner"].includes(memberData.role)) {
      throw new Error("Only organization admins can manage subscriptions");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if organization already has a Stripe customer
    const { data: existingSubscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", organizationId)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organization_id: organizationId,
          user_id: user.id,
        },
      });
      customerId = customer.id;
      logStep("Created new Stripe customer", { customerId });
    } else {
      logStep("Using existing Stripe customer", { customerId });
    }

    // Define plan configurations
    const plans = {
      "free": { price: 0, name: "Gratuit" },
      "pro": { price: 2900, name: "Pro" }, // €29.00
      "enterprise": { price: 9900, name: "Enterprise" }, // €99.00
    };

    const planConfig = plans[plan_id as keyof typeof plans];
    if (!planConfig) throw new Error("Invalid plan_id");

    logStep("Plan configuration", planConfig);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Abonnement ${planConfig.name}`,
              description: `Accès complet aux fonctionnalités ${planConfig.name}`,
            },
            unit_amount: planConfig.price,
            recurring: planConfig.price > 0 ? { interval: "month" } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: planConfig.price > 0 ? "subscription" : "payment",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        organization_id: organizationId,
        plan_id,
        user_id: user.id,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Update or create subscription record
    await supabaseAdmin
      .from("subscriptions")
      .upsert({
        organization_id: organizationId,
        stripe_customer_id: customerId,
        plan_id,
        plan_name: planConfig.name,
        status: "pending",
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "organization_id",
      });

    logStep("Subscription record updated");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});