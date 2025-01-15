import useSessionId from "@/hooks/useSessionId";

/**
 * SessionId 컴포넌트
 * 현재 채팅 세션의 ID를 표시하는 컴포넌트입니다.
 * 디버깅 및 지원 목적으로 사용됩니다.
 * 
 * @returns {JSX.Element|null} 세션 ID가 있는 경우 표시 요소, 없으면 null
 */
export default function SessionId() {
  const sessionId = useSessionId();
  if (!sessionId) return null;

  return (
    <div className="allm-text-xs allm-text-gray-300 allm-w-full allm-text-center">
      {sessionId}
    </div>
  );
}
