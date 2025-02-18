import "~/styles/index.css";

import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import ReactDOM from "react-dom/client";
import SuperJSON from "superjson";

import NotFoundError from "~/components/errors/not-found";
import { Toaster } from "~/components/ui/sonner";
import { routeTree } from "~/route-tree.gen";

import GeneralError from "./components/errors/general-error";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 30 * 1000,
    },
    dehydrate: {
      serializeData: SuperJSON.serialize,
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
    hydrate: {
      deserializeData: SuperJSON.deserialize,
    },
  },
});

const router = createRouter({
  routeTree,
  defaultPreload: false,
  context: { queryClient },
  defaultNotFoundComponent: NotFoundError,
  defaultErrorComponent: GeneralError,
  Wrap: ({ children }) => {
    return (
      <NuqsAdapter>
        {children}
        <Toaster />
      </NuqsAdapter>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
