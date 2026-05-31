import { useCallback, useMemo, useRef } from "react";

export function useNavigationActionGuard() {
  const lockRef = useRef({ key: null, expiresAt: 0 });

  const runOnce = useCallback((key, action, lockMs = 700) => {
    const now = Date.now();
    const lock = lockRef.current;

    if (lock.key === key && now < lock.expiresAt) {
      return;
    }

    lockRef.current = {
      key,
      expiresAt: now + lockMs,
    };

    action();
  }, []);

  const createGuardedNavigation = useCallback(
    (navigation) => ({
      ...navigation,
      push: (routeName, params) => {
        runOnce(`push:${routeName}`, () => navigation.push(routeName, params));
      },
      navigate: (routeName, params) => {
        runOnce(`navigate:${routeName}`, () => navigation.navigate(routeName, params));
      },
      replace: (routeName, params) => {
        runOnce(`replace:${routeName}`, () => navigation.replace(routeName, params));
      },
      goBack: () => {
        runOnce("goBack", () => navigation.goBack(), 400);
      },
    }),
    [runOnce]
  );

  return useMemo(
    () => ({
      runOnce,
      createGuardedNavigation,
    }),
    [createGuardedNavigation, runOnce]
  );
}
