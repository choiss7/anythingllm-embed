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
 * ChatWindowHeader 컴포넌트는 채팅 창의 헤더 섹션을 렌더링합니다.
 * 채팅 로고, 옵션 메뉴, 닫기 버튼을 포함합니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.sessionId - 채팅 세션의 고유 식별자
 * @param {Object} [props.settings={}] - 채팅 설정 및 구성
 * @param {string|null} [props.iconUrl=null] - 사용자 정의 채팅 아이콘 URL
 * @param {Function} props.closeChat - 채팅 창을 닫는 함수
 * @param {Function} props.setChatHistory - 채팅 기록을 업데이트하는 함수
 *
 * @returns {JSX.Element} 렌더링된 ChatWindowHeader 컴포넌트
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
 * OptionsMenu 컴포넌트는 다양한 채팅 옵션이 포함된 드롭다운 메뉴를 표시합니다.
 * 채팅 초기화, 지원팀 연락, 세션 정보 보기 등의 옵션을 포함합니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.settings - 채팅 설정 및 구성
 * @param {boolean} props.showing - 메뉴 표시 여부를 제어
 * @param {Function} props.resetChat - 채팅 세션을 초기화하는 함수
 * @param {string} props.sessionId - 채팅 세션의 고유 식별자
 * @param {Object} props.menuRef - 외부 클릭 처리를 위한 React ref
 *
 * @returns {JSX.Element|null} 렌더링된 OptionsMenu 컴포넌트 또는 표시되지 않을 경우 null
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
 * SessionID 컴포넌트는 세션 ID를 표시하고 ��립보드 복사 기능을 관리합니다.
 * ID가 클립보드에 복사되면 확인 메시지를 표시합니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.sessionId - 채팅 세션의 고유 식별자
 *
 * @returns {JSX.Element|null} 렌더링된 SessionID 컴포넌트 또는 sessionId가 없을 경우 null
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
 * ContactSupport 컴포넌트는 ��리 형식이 지정된 제목이 포함된 이메일 지원 링크를 렌더링합니다.
 * 설정에 지원 이메일이 제공된 경우에만 표시됩니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string|null} props.email - 지원팀 이메일 주소
 *
 * @returns {JSX.Element|null} 렌더링된 ContactSupport 컴포넌트 또는 이메일이 없을 경우 null
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
