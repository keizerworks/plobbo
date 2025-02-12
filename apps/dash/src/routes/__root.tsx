import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { initializeAuth, useAuthStore } from "../store/auth";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await initializeAuth();
  },
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuthStore();

  return (
    <>
      <div className="flex gap-2 p-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
      </div>
      <hr />

      <Outlet />

      <hr />

      {auth.userId ? (
        <div>
          <p>
            <span>Logged in</span>
            {auth.userId && <span> as {auth.userId}</span>}
          </p>
          <div className="controls">
            <button onClick={auth.logout}>Logout</button>
          </div>
        </div>
      ) : (
        <button onClick={auth.login}>Login with OAuth</button>
      )}

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
