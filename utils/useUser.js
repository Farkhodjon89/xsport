import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

// useUser is hook to use user data in browser
export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
} = {}) {
  // request user data from backend and cache it
  // for more details check swr plugin
  const { data: userData, mutate: mutateUser } = useSWR('/api/user', {
    focusThrottleInterval: 5 * 60 * 1000
  });

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !userData) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !userData?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && userData?.isLoggedIn)
    ) {
      Router.replace(redirectTo);
    }
  }, [userData, redirectIfFound, redirectTo]);

  return { userData, mutateUser }
}
