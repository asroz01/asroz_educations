"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import MobileSidebar from "@/components/MobileSidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import AddStudentModal from "@/components/dashboard/AddStudentModal";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [cmdOpen,         setCmdOpen]         = useState(false);
  const [addStudentOpen,  setAddStudentOpen]  = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#131313] transition-colors duration-300">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {addStudentOpen && (
        <AddStudentModal
          onClose={() => setAddStudentOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          onCommandOpen={() => setCmdOpen(true)}
          onAddStudent={() => setAddStudentOpen(true)}
        />
        <SubHeader />
        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
