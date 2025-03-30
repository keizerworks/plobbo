import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { getIsLoggedIn } from "~/store/auth";

export const Route = createFileRoute("/_public")({
  beforeLoad: () => {
    try {
      const loggedIn = getIsLoggedIn();
      if (loggedIn) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect({ to: "/" });
      }
    } catch (error) {
      // If there's an error getting the login state, allow access to public routes
      console.error("Error checking login state:", error);
    }
  },
  pendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-6 shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
