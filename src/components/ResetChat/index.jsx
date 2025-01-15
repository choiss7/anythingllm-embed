import { SEND_TEXT_EVENT } from "@/components/ChatWindow/ChatContainer";
import ChatService from "@/models/chatService";

export default function ResetChat({ settings, setChatHistory, sessionId }) {
  const handleWikiSummary = () => {
    if (settings.defaultMessages) {
      const messages = typeof settings.defaultMessages === 'string' 
        ? [settings.defaultMessages]
        : settings.defaultMessages;

      if (messages.length > 0) {
        window.dispatchEvent(
          new CustomEvent(SEND_TEXT_EVENT, { 
            detail: { command: messages[0] }
          })
        );
      }
    }
  };

  const handleReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
  };

  return (
    <div className="allm-w-full allm-flex allm-justify-center allm-gap-4">
      <button
        style={{ color: "#7A7D7E" }}
        className="hover:allm-cursor-pointer allm-border-none allm-text-sm allm-bg-transparent hover:allm-opacity-80 hover:allm-underline"
        onClick={handleWikiSummary}
      >
        위키 요약
      </button>
      <button
        style={{ color: "#7A7D7E" }}
        className="hover:allm-cursor-pointer allm-border-none allm-text-sm allm-bg-transparent hover:allm-opacity-80 hover:allm-underline"
        onClick={handleReset}
      >
        초기화
      </button>
    </div>
  );
}
