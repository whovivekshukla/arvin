import { Sidebar } from "@/components/SideBar";
import Chat from "@/components/Chat";

export default function SidebarAndChat() {
  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-screen w-full">
      <Sidebar />
      <Chat />
    </div>
  );
}
