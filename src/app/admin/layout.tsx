import SideBar from "@/components/side_bar/side_bar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* <div className="w-full flex-none md:w-64">
        <SideBar />
      </div> */}
      <div className="flex-grow">{children}</div>
    </div>
  );
}
