import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { isAdminSession, useSession } from "@/store/session-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const session = useSession();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAdminSession(session)) void navigate({ to: "/login" });
  }, [hydrated, navigate, session]);

  if (!hydrated || !isAdminSession(session)) return null;

  return (
    <AppShell variant="admin" userName={session!.user.name} userEmail={session!.user.nip}>
      <Outlet />
    </AppShell>
  );
}
