import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const conversations = [
    {
      id: "1",
      title: "React Hooks Explanation",
      lastMessage: new Date(),
    },
    {
      id: "2",
      title: "TypeScript Best Practices",
      lastMessage: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      title: "Tailwind CSS Tips",
      lastMessage: new Date(Date.now() - 7200000),
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          conversations={conversations}
          activeConversationId="1"
          onNewChat={() => console.log("New chat")}
          onSelectConversation={(id) => console.log("Selected:", id)}
          onDeleteConversation={(id) => console.log("Delete:", id)}
        />
        <div className="flex-1" />
      </div>
    </SidebarProvider>
  );
}
