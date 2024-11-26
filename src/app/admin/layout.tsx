import type { Metadata } from "next";

import BottomNavBar from "@/components/bottom_nav_bar/bottom_nav_bar";
import SideBar from "@/components/side_bar/side_bar";

export const metadata: Metadata = {
  title: "이리온 댕댕 by Easerve",
  description: "이리온 댕댕의 관리자 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      {/* <BottomNavBar /> */}
      <div className="flex-1 h-full w-full md:pl-12">{children}</div>
    </div>
  );
}
