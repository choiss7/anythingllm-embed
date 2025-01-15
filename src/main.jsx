// React와 필수 의존성 모듈 임포트
import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App.jsx";
import "./index.css";
import { parseStylesSrc } from "./utils/constants.js";

// 앱을 마운트할 DOM 요소 생성
const appElement = document.createElement("div");

// 생성한 요소를 body에 추가
document.body.appendChild(appElement);

// React 루트 생성 및 앱 렌더링
const root = ReactDOM.createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 현재 실행 중인 스크립트의 data 속성들을 객체로 변환
const scriptSettings = Object.assign(
  {},
  document?.currentScript?.dataset || {}
);

// 채팅 위젯의 전역 설정 객체
export const embedderSettings = {
  // 스크립트 태그에서 읽어온 설정값들
  settings: scriptSettings,
  // 스타일 소스 경로 파싱
  stylesSrc: parseStylesSrc(document?.currentScript?.src),
  // 사용자 메시지 스타일 설정
  USER_STYLES: {
    // 배경색 (기본값: #3DBEF5)
    msgBg: scriptSettings?.userBgColor ?? "#3DBEF5",
    // 기본 스타일 클래스
    base: `allm-text-white allm-rounded-t-[18px] allm-rounded-bl-[18px] allm-rounded-br-[4px] allm-mx-[20px]`,
  },
  // 어시스턴트 메시지 스타일 설정
  ASSISTANT_STYLES: {
    // 배경색 (기본값: #FFFFFF)
    msgBg: scriptSettings?.assistantBgColor ?? "#FFFFFF",
    // 기본 스타일 클래스
    base: `allm-text-[#222628] allm-rounded-t-[18px] allm-rounded-br-[18px] allm-rounded-bl-[4px] allm-mr-[37px] allm-ml-[9px]`,
  },
};
