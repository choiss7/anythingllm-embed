// 필요한 커스텀 훅과 컴포넌트들을 임포트
import useGetScriptAttributes from "@/hooks/useScriptAttributes";
import useSessionId from "@/hooks/useSessionId"; 
import useOpenChat from "@/hooks/useOpen";
import Head from "@/components/Head";
import OpenButton from "@/components/OpenButton";
import ChatWindow from "./components/ChatWindow";
import { useEffect } from "react";

export default function App() {
  // 채팅창 열림/닫힘 상태와 토글 함수
  const { isChatOpen, toggleOpenChat } = useOpenChat();
  // 임베드 설정값들을 가져오는 훅
  const embedSettings = useGetScriptAttributes();
  // 세션 ID를 관리하는 훅
  const sessionId = useSessionId();

  // 페이지 로드시 자동으로 채팅창을 열도록 하는 효과
  useEffect(() => {
    if (embedSettings.openOnLoad === "on") {
      toggleOpenChat(true);
    }
  }, [embedSettings.loaded]);

  // 설정이 로드되지 않았다면 아무것도 렌더링하지 않음
  if (!embedSettings.loaded) return null;

  // 채팅창 위치에 따른 CSS 클래스 매핑
  const positionClasses = {
    "bottom-left": "allm-bottom-0 allm-left-0 allm-ml-4",
    "bottom-right": "allm-bottom-0 allm-right-0 allm-mr-4",
    "top-left": "allm-top-0 allm-left-0 allm-ml-4 allm-mt-4",
    "top-right": "allm-top-0 allm-right-0 allm-mr-4 allm-mt-4",
  };

  // 기본 위치 및 창 크기 설정
  const position = embedSettings.position || "bottom-right";
  const windowWidth = embedSettings.windowWidth ?? "400px";
  const windowHeight = embedSettings.windowHeight ?? "700px";

  return (
    <>
      <Head />
      {/* 채팅창 컨테이너 */}
      <div
        id="anything-llm-embed-chat-container"
        className={`allm-fixed allm-inset-0 allm-z-50 ${isChatOpen ? "allm-block" : "allm-hidden"}`}
      >
        {/* 채팅창 */}
        <div
          style={{
            maxWidth: windowWidth,
            maxHeight: windowHeight,
          }}
          className={`allm-h-full allm-w-full allm-bg-white allm-fixed allm-bottom-0 allm-right-0 allm-mb-4 allm-md:mr-4 allm-rounded-2xl allm-border allm-border-gray-300 allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)] ${positionClasses[position]}`}
          id="anything-llm-chat"
        >
          {/* 채팅창이 열려있을 때만 ChatWindow 컴포넌트 렌더링 */}
          {isChatOpen && (
            <ChatWindow
              closeChat={() => toggleOpenChat(false)}
              settings={embedSettings}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>
      {/* 채팅창이 닫혀있을 때 표시되는 열기 버튼 */}
      {!isChatOpen && (
        <div
          id="anything-llm-embed-chat-button-container"
          className={`allm-fixed allm-bottom-0 ${positionClasses[position]} allm-mb-4 allm-z-50`}
        >
          <OpenButton
            settings={embedSettings}
            isOpen={isChatOpen}
            toggleOpen={() => toggleOpenChat(true)}
          />
        </div>
      )}
    </>
  );
}
