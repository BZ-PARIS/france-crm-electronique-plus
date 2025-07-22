import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../hooks/use-mobile';

// helper to mock matchMedia
function mockMatchMedia() {
  let listener: (() => void) | undefined;
  return {
    addEventListener: (_: string, l: () => void) => {
      listener = l;
    },
    removeEventListener: jest.fn(),
    dispatch: () => {
      if (listener) listener();
    },
  };
}

describe('useIsMobile', () => {
  test('returns true when width below breakpoint', () => {
    const mql = mockMatchMedia();
    jest.spyOn(window, 'matchMedia').mockImplementation(() => mql as unknown as MediaQueryList);
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test('updates when width changes', () => {
    const mql = mockMatchMedia();
    jest.spyOn(window, 'matchMedia').mockImplementation(() => mql as unknown as MediaQueryList);
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 900 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
      mql.dispatch();
    });
    expect(result.current).toBe(true);
  });
});
