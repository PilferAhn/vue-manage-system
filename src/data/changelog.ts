// 변경 이력 (사이드바 맨 아래 "변경 이력" → /changelog 화면에 표시)
// 새 변경은 맨 위에 추가. header.vue 의 LAST_UPDATED 날짜도 같이 바꿀 것

export type ChangeLogItem = { area: string; text: string };
export type ChangeLogEntry = { date: string; author: string; items: ChangeLogItem[] };

export const CHANGELOG: ChangeLogEntry[] = [
  {
    date: "2026-11-22",
    author: "오해관",
    items: [
      { area: "로그인", text: "브라우저를 닫았다 다시 열면 로그아웃되고 로그인 화면부터 시작 (이전 화면이 로그인된 채 열리던 문제 수정)" },

      { area: "메인 화면", text: "개발자용 메인 화면으로 변경: 사용자 정보·접속 시간, 바로가기(샘플 의뢰서 작성), 진행 요약(투입 대기/FAB/HQ·출하/WHC/WHC 입고/작성한 의뢰서)" },
      { area: "메인 화면", text: "My Form List: 본인 의뢰서, [의뢰서 입력] 버튼 강조, 수정자 MES 변경 내용 표시" },
      { area: "메인 화면", text: "내 샘플 모니터: Sample Monitor 표 그대로(FAB → HQ → WHC 진행), 본인 샘플만, 좌우 스크롤" },
      { area: "메인 화면", text: "달력: 내 샘플 일정(투입 계획/FAB 투입/OUT 계획/FAB OUT/WHC 도착), 한국 공휴일·창립기념일(9/1) 표시" },
      { area: "메인 화면", text: "admin 계정은 기존 메인 화면 유지" },

      { area: "일본어(WJC)", text: "WJC 소속 사용자: 메인 화면, 의뢰서 작성 P/N 안내, 이전 차수 불러오기 팝업, 투입취소 안내 팝업을 일본어로 표시 (원어민 검수 전)" },

      { area: "Sample Monitor", text: "조회 기간 선택 추가 (60/120/180일, 기본 60일) → 조회 속도 개선" },
      { area: "Sample Monitor", text: "개발자 이름 강조, FAB 현위치 한 줄 표시(넘치면 … / 마우스를 대면 전체), 스크롤바 길이 오류 수정" },

      { area: "Fab Card 작성 현황", text: "모니터 표시용으로 화면에 꽉 차게, No 열 제거, 5분 자동 새로고침" },
      { area: "Fab Card 작성 현황", text: "빨간 행 깜박임 (매일 07:00~22:00), 시간이 지나면 색 자동 갱신, 새로고침 때 중복 행 생기던 문제 수정" },
      { area: "Fab Card 작성 현황", text: "Not Found 밑 '투입취소 확인 요망' 표시, 투입예정일 3일 전까지는 'MES 등록 대기'로 표시" },
      { area: "Fab Card 작성 현황", text: "투입취소 확인 대상 건은 해당 개발자 로그인 시 팝업 안내 (My Form List 에서 Delete 안내)" },
      { area: "Fab Card 작성 현황", text: "연초(1월 1~2주)에 작년 말 주차 건이 빠지던 문제 수정" },

      { area: "MES 연동", text: "MES 투입계획(10.20.10.128) 기준 매수/투입예정일 자동 보정 (평일 08~19시 30분마다), 수정자 'MES' 로 기록" },
      { area: "MES 연동", text: "수정자 MES 의 변경 내용(항목/변경 전→후) 이력 저장, My Form List 에서 MES 에 마우스를 대면 확인" },

      { area: "의뢰서", text: "의뢰서 선택 팝업에서 화면 이동 후 홈 버튼이 눌리지 않던 문제 수정" },
      { area: "Admin Option", text: "의뢰서 입력 가능 기간 자동 설정: 매주 토 00:00 ~ 월 23:59 (매주 금 16:10 자동 갱신)" },
      { area: "공통", text: "회사 공휴일 2027년 추가, 2026-07-17 휴일 인식 오류 수정 (Fab Card 전달일·리드타임 계산)" },
      { area: "공통", text: "상단에 업데이트 날짜/개발자/개선 요청 안내 표시, DV2 메뉴 사용 중지" },
      { area: "서버", text: "백엔드 작업자 4 → 8개 (동시 접속 대비)" },
    ],
  },
];
