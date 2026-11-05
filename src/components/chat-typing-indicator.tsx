import AssistantFace from "@/components/assistant-face";

export default function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <AssistantFace size={34} interactive={false} />
      <div className="flex items-center gap-1 rounded-full border border-line bg-panel-muted px-3 py-2.5">
        <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted" />
      </div>
    </div>
  );
}
