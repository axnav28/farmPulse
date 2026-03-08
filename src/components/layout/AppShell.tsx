import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopCommandBar from "./TopCommandBar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-800">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(6,182,212,0.18),transparent_35%),radial-gradient(circle_at_100%_20%,rgba(14,165,233,0.14),transparent_38%)]" />
      <div className="mx-auto flex min-h-screen max-w-[1780px] flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:items-start lg:gap-5 lg:p-5">
        <div className="w-full lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-72 lg:shrink-0">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          <TopCommandBar />
          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
