import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "@/services/i18n";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { AuthProvider } from "@/providers/auth-provider.tsx";
import QueryProvider from "./providers/query-provider.tsx";
import I18nProvider from "./providers/i18n-provider.tsx";
import ToastProvider from "./providers/toast-provider.tsx";
import ThemeProvider from "./providers/theme-provider.tsx";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <I18nProvider>
              <RouterProvider router={router} />
              <ToastProvider />
            </I18nProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
