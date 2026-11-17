import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { isMemberSession, useSession } from "@/store/session-store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const session = useSession();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isMemberSession(session)) void navigate({ to: "/login" });
  }, [hydrated, navigate, session]);

  if (!hydrated || !isMemberSession(session)) return null;

  return (
    <AppShell variant="member" userName={session!.user.name} userEmail={session!.user.nip}>
      <Outlet />
    </AppShell>
  );
}
