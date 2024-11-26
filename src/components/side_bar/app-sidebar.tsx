import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { IAppSidebar } from "@/types/interface";

// Menu items.
const items = [
  {
    title: "예약",
    url: "/admin",
    icon: Calendar,
  },

  {
    title: "설정",
    url: "/admin",
    icon: Settings,
  },
];

export function AppSidebar({ open, onOpenChange }: IAppSidebar) {
  return (
    <Sidebar
      className="bg-white absolute z-10"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader>
        <Link
          href="/admin"
          className="flex h-16 items-center justify-start gap-2 overflow-hidden"
        >
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full bg-white border border-gray-200"
          />
          <span className={`text-2xl font-semibold truncate`}>이리온 댕댕</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="p-2 flex items-center gap-2"
                    >
                      <item.icon />
                      <span className="text-lg truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/" className="p-2 flex justify-start items-center gap-2">
          <div className="min-w-5 min-h-5">
            <LogOut width={20} height={20} />
          </div>
          <span className={`text-lg truncate`}>Log out</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
