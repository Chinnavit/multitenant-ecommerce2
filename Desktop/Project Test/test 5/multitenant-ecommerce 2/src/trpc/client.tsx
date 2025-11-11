'use client';
// ^-- to make sure we can mount the Provider from a server component
import superjson from "superjson";
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
/**
 * Provide a TanStack Query `QueryClient` appropriate for the current environment.
 *
 * On the server this creates and returns a new `QueryClient` for each call.
 * In the browser it lazily creates and returns a singleton `QueryClient` shared across renders.
 *
 * @returns A `QueryClient` instance: a fresh client on server calls, or the shared browser client when running in a browser.
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
/**
 * Build the base URL for the TRPC HTTP endpoint appropriate to the current environment.
 *
 * On the browser this produces "/api/trpc". On the server this prepends the value of
 * `process.env.NEXT_PUBLIC_APP_URL` and returns "<NEXT_PUBLIC_APP_URL>/api/trpc".
 *
 * @returns The full TRPC endpoint URL as a string.
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_APP_URL;
  })();
  return `${base}/api/trpc`;
}
/**
 * Provides TRPC and TanStack Query contexts to the React subtree, wiring a stable QueryClient and a TRPC client configured with superjson and an HTTP batch link.
 *
 * @param props.children - The React node(s) that will receive the TRPC and QueryClient contexts.
 * @returns The children wrapped with QueryClientProvider and TRPCProvider.
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}