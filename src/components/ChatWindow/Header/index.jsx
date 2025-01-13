import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import ChatService from "@/models/chatService";
import {
  ArrowCounterClockwise,
  Check,
  Copy,
  DotsThreeOutlineVertical,
  Envelope,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

/**
 * ChatWindowHeader 컴포넌트는 채팅 창의 헤더를 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트 속성.
 * @param {string} props.sessionId - 채팅의 세션 ID.
 * @param {Object} [props.settings={}] - 채팅 설정.
 * @param {string|null} [props.iconUrl=null] - 표시할 아이콘의 URL.
 * @param {Function} props.closeChat - 채팅을 닫는 함수.
 * @param {Function} props.setChatHistory - 채팅 기록을 설정하는 함수.
 *
 * @returns {JSX.Element} 렌더링된 ChatWindowHeader 컴포넌트.
 */
export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
}) {
  const [showingOptions, setShowOptions] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  // 채팅을 초기화하는 함수
  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    setShowOptions(false);
  };

  // 메뉴 외부 클릭 시 옵션 메뉴를 닫는 함수
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      style={{ borderBottom: "1px solid #E9E9E9" }}
      className="allm-flex allm-items-center allm-relative allm-rounded-t-2xl"
      id="anything-llm-header"
    >
      <div className="allm-flex allm-justify-center allm-items-center allm-w-full allm-h-[76px]">
        <img
          style={{ /*maxWidth: 48, maxHeight: 48*/ }}
          src={iconUrl ?? AnythingLLMIcon}
          alt={iconUrl ? "Brand" : "AnythingLLM Logo"}
        />
      </div>
      <div className="allm-absolute allm-right-0 allm-flex allm-gap-x-1 allm-items-center allm-px-[22px]">
        {settings.loaded && (
          <button hidden  
            ref={buttonRef}
            type="button"
            onClick={() => setShowOptions(!showingOptions)}
            className="allm-bg-transparent hover:allm-cursor-pointer allm-border-none hover:allm-bg-gray-100 allm-rounded-sm allm-text-slate-800/60"
            aria-label="Options"
          >
            <DotsThreeOutlineVertical size={20} weight="fill" />
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className="allm-bg-transparent hover:allm-cursor-pointer allm-border-none hover:allm-bg-gray-100 allm-rounded-sm allm-text-slate-800/60"
          aria-label="Close"
        >
          <X size={20} weight="bold" />
        </button>
      </div>
      <OptionsMenu
        settings={settings}
        showing={showingOptions}
        resetChat={handleChatReset}
        sessionId={sessionId}
        menuRef={menuRef}
      />
    </div>
  );
}

/**
 * OptionsMenu 컴포넌트는 옵션 메뉴를 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트 속성.
 * @param {Object} props.settings - 채팅 설정.
 * @param {boolean} props.showing - 옵션 메뉴 표시 여부.
 * @param {Function} props.resetChat - 채팅을 초기화하는 함수.
 * @param {string} props.sessionId - 채팅의 세션 ID.
 * @param {Object} props.menuRef - 메뉴 참조 객체.
 *
 * @returns {JSX.Element|null} 렌더링된 OptionsMenu 컴포넌트 또는 null.
 */
function OptionsMenu({ settings, showing, resetChat, sessionId, menuRef }) {
  if (!showing) return null;
  return (
    <div
      ref={menuRef}
      className="allm-bg-white allm-absolute allm-z-10 allm-flex allm-flex-col allm-gap-y-1 allm-rounded-xl allm-shadow-lg allm-top-[64px] allm-right-[46px]"
    >
      <button
        onClick={resetChat}
        className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
      >
        <ArrowCounterClockwise size={24} />
        <p className="allm-text-[14px]">Reset Chat</p>
      </button>
      <ContactSupport email={settings.supportEmail} />
      <SessionID sessionId={sessionId} />
      <p>LLM Model</p>
    </div>
  );
}

/**
 * SessionID 컴포넌트는 세션 ID를 표시하고 복사하는 기능을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 속성.
 * @param {string} props.sessionId - 채팅의 세션 ID.
 *
 * @returns {JSX.Element|null} 렌더링된 SessionID 컴포넌트 또는 null.
 */
function SessionID({ sessionId }) {
  if (!sessionId) return null;

  const [sessionIdCopied, setSessionIdCopied] = useState(false);

  // 세션 ID를 클립보드에 복사하는 함수
  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setSessionIdCopied(true);
    setTimeout(() => setSessionIdCopied(false), 1000);
  };

  if (sessionIdCopied) {
    return (
      <div className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4">
        <Check size={24} />
        <p className="allm-text-[14px] allm-font-sans">Copied!</p>
      </div>
    );
  }

  return (
    <button
      onClick={copySessionId}
      className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
    >
      <Copy size={24} />
      <p className="allm-text-[14px]">Session ID</p>
    </button>
  );
}

/**
 * ContactSupport 컴포넌트는 이메일 지원 링크를 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트 속성.
 * @param {string|null} props.email - 지원 이메일 주소.
 *
 * @returns {JSX.Element|null} 렌더링된 ContactSupport 컴포넌트 또는 null.
 */
function ContactSupport({ email = null }) {
  if (!email) return null;

  const subject = `Inquiry from ${window.location.origin}`;
  return (
    <a
      href={`mailto:${email}?Subject=${encodeURIComponent(subject)}`}
      className="allm-no-underline hover:allm-underline hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
    >
      <Envelope size={24} />
      <p className="allm-text-[14px] allm-font-sans">Email Support</p>
    </a>
  );
}
