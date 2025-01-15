import {
  Plus,
  ChatCircleDots,
  Headset,
  Binoculars,
  MagnifyingGlass,
  MagicWand,
} from "@phosphor-icons/react";

/**
 * OpenButton 컴포넌트
 * 채팅창을 열기 위한 플로팅 버튼 컴포넌트입니다.
 * 다양한 아이콘 옵션을 지원합니다.
 * 
 * @param {Object} props
 * @param {Object} props.settings - 버튼 설정
 * @param {boolean} props.isOpen - 채팅창 열림 상태
 * @param {Function} props.toggleOpen - 채팅창 토글 함수
 */

// 지원되는 채팅 아이콘 매핑
const CHAT_ICONS = {
  plus: Plus,
  chatBubble: ChatCircleDots,
  support: Headset,
  search2: Binoculars,
  search: MagnifyingGlass,
  magic: MagicWand,
};

export default function OpenButton({ settings, isOpen, toggleOpen }) {
  if (isOpen) return null;
  const ChatIcon = CHAT_ICONS.hasOwnProperty(settings?.chatIcon)
    ? CHAT_ICONS[settings.chatIcon]
    : CHAT_ICONS.plus;
  return (
    <button
      style={{ backgroundColor: settings.buttonColor }}
      id="anything-llm-embed-chat-button"
      onClick={toggleOpen}
      className={`hover:allm-cursor-pointer allm-border-none allm-flex allm-items-center allm-justify-center allm-p-4 allm-rounded-full allm-text-white allm-text-2xl hover:allm-opacity-95`}
      aria-label="Toggle Menu"
    >
      <ChatIcon className="text-white" />
    </button>
  );
}
