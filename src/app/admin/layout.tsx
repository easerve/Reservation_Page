import BottomNavBar from "@/components/bottom_nav_bar/bottom_nav_bar";
import SideBar from "@/components/side_bar/side_bar";

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
