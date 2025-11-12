import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

/**
 * Create a preconfigured React Query client for the application.
 *
 * Configures queries with a 30-second stale time, uses superjson for
 * de/serialization during dehydrate/hydrate, and treats queries with state
 * status `"pending"` as eligible for dehydration in addition to the default
 * criteria.
 *
 * @returns A `QueryClient` instance with the above default options applied.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}