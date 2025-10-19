import { ChatInput } from "../ChatInput";

export default function ChatInputExample() {
  return (
    <div className="h-40">
      <ChatInput onSend={(msg) => console.log("Message sent:", msg)} />
    </div>
  );
}
