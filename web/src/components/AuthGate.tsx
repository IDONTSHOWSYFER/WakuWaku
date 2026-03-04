"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/authStore";

export default function AuthGate({
  children,
  message = "Connecte-toi pour utiliser cette fonctionnalité.",
  loginHref = "/auth/login",
  registerHref = "/auth/register",
}: {
  children?: React.ReactNode;
  message?: string;
  loginHref?: string;
  registerHref?: string;
}) {
  const { user } = useAuthUser();

  if (user) return <>{children ?? null}</>;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl bg-white/60 border border-white/70 px-4 py-3">
      <div className="text-sm text-zinc-700">{message}</div>
      <div className="flex gap-2">
        <Link className="btn btn-primary !py-2 !px-3 text-sm" href={loginHref}>
          Se connecter
        </Link>
        <Link className="btn btn-soft !py-2 !px-3 text-sm" href={registerHref}>
          Créer un compte
        </Link>
      </div>
    </div>
  );
}