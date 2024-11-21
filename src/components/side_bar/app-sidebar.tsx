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
} from "@/components/ui/sidebar";

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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin" className="p-2 flex items-center gap-2">
          <Image
            src="/svgs/easerve.svg"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          <span className="text-2xl font-semibold">이리온 댕댕</span>
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
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/" className="p-2 flex items-center gap-2">
          <LogOut />
          <span className="text-lg">Log out</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
