import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

/**
 * Create a QueryClient preconfigured with application defaults for querying, hydration, and dehydration.
 *
 * The client uses a 30-second `staleTime` for queries, `superjson` for serialization and deserialization during
 * dehydrate/hydrate, and a `shouldDehydrateQuery` policy that dehydrates queries that either match the default
 * dehydrate criteria or are currently in the `pending` state.
 *
 * @returns A `QueryClient` instance configured with the described defaults
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