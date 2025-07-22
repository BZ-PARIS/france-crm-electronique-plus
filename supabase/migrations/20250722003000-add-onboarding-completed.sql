-- Add onboarding_completed column to profiles
ALTER TABLE public.profiles
  ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT false;
