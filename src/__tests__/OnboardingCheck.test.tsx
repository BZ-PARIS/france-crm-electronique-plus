import { render } from '@testing-library/react';
import React from 'react';
import { OnboardingCheck } from '../components/OnboardingCheck';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/dashboard' }),
}));

const { useAuth } = jest.requireMock('../contexts/AuthContext');

describe('OnboardingCheck', () => {
  test('renders children when onboarding completed', () => {
    useAuth.mockReturnValue({ user: {}, loading: false, profile: { onboarding_completed: true } });
    const { getByText } = render(
      <OnboardingCheck>
        <div>child</div>
      </OnboardingCheck>
    );
    expect(getByText('child')).toBeInTheDocument();
  });

  test('hides children when onboarding incomplete', () => {
    useAuth.mockReturnValue({ user: {}, loading: false, profile: { onboarding_completed: false } });
    const { queryByText } = render(
      <OnboardingCheck>
        <div>child</div>
      </OnboardingCheck>
    );
    expect(queryByText('child')).toBeNull();
  });
});
