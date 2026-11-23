// 변경 이력 (사이드바 맨 아래 "변경 이력" → /changelog 화면에 표시)
// 새 변경은 맨 위에 추가. header.vue 의 LAST_UPDATED 날짜도 같이 바꿀 것

export type ChangeLogItem = { area: string; text: string };
export type ChangeLogEntry = { date: string; author: string; items: ChangeLogItem[] };

export const CHANGELOG: ChangeLogEntry[] = [
  {
    date: "2026-11-23",
    author: "오해관",
    items: [
      { area: "메인 화면", text: "바로가기에 [작성된 의뢰 항목 (TEG/PDT)] 버튼 복구 → 내 의뢰서 목록(TEG/PDT) 화면 (사용자 요청)" },
      { area: "의뢰서 작성", text: "의뢰서 작성/보기 화면에서는 마우스를 왼쪽으로 옮겨도 메뉴가 자동으로 펼쳐지지 않음 (사용자 요청)" },
      { area: "공통", text: "상단 홈 버튼 옆에 메뉴 열기/닫기 아이콘 추가" },
      { area: "공통", text: "왼쪽 메뉴 자동 펼침 대기 시간 0.15초 → 0.5초 (너무 빨리 펼쳐진다는 요청), 접힘 대기 0.4초" },
      { area: "공통", text: "메뉴 고정 추가: 메뉴 맨 아래 [📌 메뉴 고정] → 화면을 골라도 접히지 않고 재접속해도 펼친 상태 유지 (사람마다 브라우저에 저장)" },
      { area: "공통", text: "메뉴 이름 짧게: Power Durability Test → PDT, Teg Measurement → TEG, WHC Measurement → WHC, Statistics → 통계, Create Request Form → 의뢰서, Development SAMPLE → 개발 샘플, CSP Req Form List → CSP 리스트, Measurement monitor → 측정 현황" },
      { area: "공통", text: "메뉴 폭 250 → 190px: 긴 메뉴 이름 줄임(Package(PCB) COST → PKG cost, K1 IND/CAP 기준값, 완제품 (Reel), Solder/LOT 등록, Fab Card 현황, SPL 현황 (HQ), TCF 계산기, PDT/TEG/WHC 통계 등), 그래도 길면 두 줄로 표시" },
      { area: "의뢰서 작성", text: "이전 차수 불러오기에 Package, Designer, Band, Filter Type 추가" },
      { area: "코드 정리", text: "코드 리뷰 반영: MES 자동 보정이 값 변화 없이 '수정자 MES' 로 기록되던 가능성 제거, MES 연동 중 서버 응답이 멈추던 구조 수정, 서버 작업자 4개로 복귀(주기 작업 중복 실행 방지)" },
      { area: "코드 정리", text: "휴일 목록을 한 곳(korean-holidays.ts)에서 관리, 로그아웃 처리 통일, Fab Card 화면 안 쓰는 코드 정리, 백업 파일 삭제" },
      { area: "Form Review", text: "엑셀 버튼을 위로 이동(통계·투입일 필터와 한 줄), 표가 화면 아래까지 채움, 불필요한 여백 제거" },
      { area: "Form Review", text: "엑셀: 만드는 동안(약 30초) 안내 유지·버튼 잠금(중복 요청 방지), 주차 선택 53주까지, Fab Card 전달일 날짜 형식 통일" },
      { area: "Form Review", text: "주차 탭을 오갈 때 느리던 문제 수정: 한 번 연 탭은 유지(다시 조회/그리기 안 함), [새로고침] 버튼 추가, Delay/Drop 후 Fab Card 작성 여부도 다시 확인" },
    ],
  },
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
