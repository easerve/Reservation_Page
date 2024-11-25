"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side_bar/app-sidebar";
import { useState, useEffect } from "react";

export default function SideBar() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const sidebar = document.getElementById("adminSidebar");

    const handleMouseEnter = () => {
      setOpen(true);
    };
    const handleMouseLeave = () => {
      setOpen(false);
    };

    sidebar.addEventListener("mouseenter", handleMouseEnter);
    sidebar.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      sidebar.removeEventListener("mouseenter", handleMouseEnter);
      sidebar.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <SidebarProvider
      id="adminSidebar"
      open={open}
      onOpenChange={setOpen}
      className="absolute"
    >
      <AppSidebar open={open} onOpenChange={setOpen} />
    </SidebarProvider>
  );
}
