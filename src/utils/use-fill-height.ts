// 표(el-table) 높이를 "현재 위치부터 화면 아래 끝까지"로 맞춘다.
// - 표가 화면보다 길어 페이지 전체가 스크롤되고, 가로 스크롤바가 화면 밖으로 밀려나는 문제 방지
// - 창 크기 변경, 왼쪽 메뉴 접기/펴기(너비 변경), 탭 전환(숨김→표시), keep-alive 복귀 시 다시 계산
//
// 사용법:
//   const tableBox = ref<HTMLElement | null>(null);
//   const { height: tableHeight } = useFillHeight(tableBox, 20);
//   <div ref="tableBox"><el-table :height="tableHeight" ...></div>
//
// bottomGap: 표 아래에 남겨 둘 공간(px). 표 아래 버튼/페이지 번호, 바깥 여백 등을 더한 값.

import { ref, onMounted, onBeforeUnmount, onActivated, nextTick, type Ref } from "vue";

export function useFillHeight(
  target: Ref<HTMLElement | null>,
  bottomGap = 20,
  minHeight = 300
) {
  const height = ref<number>(minHeight);
  let observer: ResizeObserver | null = null;
  let frame = 0;

  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const el = target.value;
      // 숨겨진 상태(비활성 탭 등)에서는 위치를 알 수 없으므로 건너뜀 → 표시될 때 ResizeObserver 가 다시 호출
      if (!el || el.offsetParent === null) return;
      const top = el.getBoundingClientRect().top;
      const next = Math.max(minHeight, Math.floor(window.innerHeight - top - bottomGap));
      if (next !== height.value) height.value = next;
    });
  };

  onMounted(() => {
    window.addEventListener("resize", update);
    if (typeof ResizeObserver !== "undefined" && target.value) {
      observer = new ResizeObserver(update);
      observer.observe(target.value);
    }
    nextTick(update);
  });

  onActivated(() => nextTick(update));

  onBeforeUnmount(() => {
    window.removeEventListener("resize", update);
    observer?.disconnect();
    cancelAnimationFrame(frame);
  });

  return { height, update };
}
