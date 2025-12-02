import { defineConfig } from "orval";

export default defineConfig({
  azeel: {
    input: "./openapi/azeel.json",
    output: {
      target: "./src/services/api/generated/azeel.ts",
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          name: "customInstance",
          path: "./src/services/api/base/orvalMutator.ts",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useInfiniteQueryParam: "page",
          options: {
            staleTime: 10_000,
          },
          queryOptions: {
            name: "infiniteOptions",
            path: "./src/services/api/base/orvalMutator.ts",
          },
        },
        tags: {
          Paginated: {
            query: {
              useInfinite: true,
            },
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write ./src/services/api/generated",
    },
  },
});
