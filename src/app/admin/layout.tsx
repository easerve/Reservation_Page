import SideBar from "@/components/side_bar/side_bar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="w-12"></div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
