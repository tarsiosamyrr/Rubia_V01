import AssistantFace from "@/components/assistant-face";

export type ChatRole = "user" | "assistant";
export type ChatMessageData = { id: number; role: ChatRole; text: string };

// Bubble shapes measured from the Figma "Message" component (node 25:76): user bubbles
// are solid brand-purple with a flattened bottom-right corner, assistant bubbles sit
// next to the Oxy avatar with a flattened top-left corner.
export default function ChatMessage({ role, text }: { role: ChatRole; text: string }) {
  if (role === "user") {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-br-md bg-[#681ce3] px-4 py-3 text-[17px] leading-6 tracking-[-0.2px] text-white">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-start gap-2">
      <AssistantFace size={34} interactive={false} />
      <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-line bg-panel-muted px-4 py-3 text-[17px] leading-6 tracking-[-0.2px] text-foreground">
        {text}
      </div>
    </div>
  );
}
