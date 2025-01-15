import { SEND_TEXT_EVENT } from "@/components/ChatWindow/ChatContainer";
import ChatService from "@/models/chatService";
import { useEffect, useState } from "react";

/**
 * ResetChat 컴포넌트
 * 채팅 초기화와 위키 요약 기능을 제공하는 컴포넌트입니다.
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.settings - 채팅 설정 정보
 * @param {Function} props.setChatHistory - 채팅 히스토리를 업데이트하는 함수
 * @param {string} props.sessionId - 채팅 세션 ID
 */
export default function ResetChat({ settings, setChatHistory, sessionId }) {
  // wiki-page 요소의 존재 여부를 추적하는 상태
  const [hasWikiContent, setHasWikiContent] = useState(false);

  // 컴포넌트 마운트 시 wiki-page 요소 확인
  useEffect(() => {
    // DOM에서 wiki-page 클래스를 가진 요소 검색
    const wikiElement = document.querySelector('.wiki.wiki-page');
    // 요소의 존재 여부를 상태에 저장 (!!로 boolean으로 변환)
    setHasWikiContent(!!wikiElement);
  }, []);

  /**
   * 위키 요약 기능을 처리하는 함수
   * settings.defaultMessages의 내용을 채팅 메시지로 전송합니다.
   */
  const handleWikiSummary = () => {
    if (settings.defaultMessages) {
      // defaultMessages가 문자열인 경우 배열로 변환
      const messages = typeof settings.defaultMessages === 'string' 
        ? [settings.defaultMessages]
        : settings.defaultMessages;

      // 메시지가 존재하는 경우 첫 번째 메시지를 전송
      if (messages.length > 0) {
        window.dispatchEvent(
          new CustomEvent(SEND_TEXT_EVENT, { 
            detail: { command: messages[0] }
          })
        );
      }
    }
  };

  /**
   * 채팅을 초기화하는 함수
   * 서버의 채팅 세션을 초기화하고 로컬 채팅 히스토리를 비웁니다.
   */
  const handleReset = async () => {
    // 서버의 채팅 세션 초기화
    await ChatService.resetEmbedChatSession(settings, sessionId);
    // 로컬 채팅 히스토리 초기화
    setChatHistory([]);
  };

  return (
    <div className="allm-w-full allm-flex allm-justify-center allm-gap-4">
      {/* wiki-page 요소가 존재할 때만 위키 요약 버튼 표시 */}
      {hasWikiContent && (
        <button
          style={{ color: "#7A7D7E" }}
          className="hover:allm-cursor-pointer allm-border-none allm-text-sm allm-bg-transparent hover:allm-opacity-80 hover:allm-underline"
          onClick={handleWikiSummary}
        >
          위키 요약
        </button>
      )}
      {/* 채팅 초기화 버튼 */}
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
