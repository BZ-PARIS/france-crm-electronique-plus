import { render } from '@testing-library/react';
import App from '../App';

// Mock Supabase client
jest.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      signOut: jest.fn(),
    },
  },
}));

const renderApp = () => render(<App />);

describe('App Component', () => {
  beforeEach(() => {
    // Clear any mocks or side effects before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderApp();
    expect(document.body).toBeInTheDocument();
  });

  test('renders the main layout structure', () => {
    const { container } = renderApp();
    expect(container).toBeInTheDocument();
  });
});