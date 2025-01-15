/**
 * Sponsor 컴포넌트
 * 스폰서 정보를 표시하는 컴포넌트입니다.
 * 설정에 따라 스폰서 링크와 텍스트를 표시합니다.
 * 
 * @param {Object} props
 * @param {Object} props.settings - 스폰서 관련 설정
 * @returns {JSX.Element|null} 스폰서 정보 표시 요소 또는 null
 */
export default function Sponsor({ settings }) {
  if (!!settings.noSponsor) return null;

  return (
    <div className="allm-flex allm-w-full allm-items-center allm-justify-center">
      <a
        style={{ color: "#0119D9" }}
        href={settings.sponsorLink ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="allm-text-xs allm-font-sans hover:allm-opacity-80 hover:allm-underline"
      >
        {settings.sponsorText}
      </a>
    </div>
  );
}
