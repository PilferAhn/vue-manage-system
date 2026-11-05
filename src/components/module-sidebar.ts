import { SidebarItem } from "../interface/sidebar";

export const moduleSilderBarList: SidebarItem = {
  icon: "Pear",
  index: "7",
  title: "모듈 (Module)",
  permiss: "11",
  subs: [
    // 구 버전 의뢰서 작성/의뢰 항목은 메뉴에서 제외 (NEW 화면 사용). 라우트는 기존 링크 호환을 위해 유지
    // {
    //   index: "/modules/application/create",
    //   title: "의뢰서 작성",
    //   permiss: "11",
    // },
    // {
    //   index: "/modules/application/list",
    //   title: "의뢰 항목",
    //   permiss: "11",
    // },
    {
      index: "/modules/application/create_new",
      title: "의뢰서 작성",
      permiss: "11",
    },
    {
      index: "/modules/application/list_new",
      title: "의뢰 항목",
      permiss: "11",
    },
    {
      index: "/modules/application/ordersheet",
      title: "모듈 조립의뢰서",
      permiss: "11",
    },
    {
      index: "/modules/application/bomwait",
      title: "봄 대기열",
      permiss: "11",
    },
    {
      index: "/modules/application/modulemeterialqty",
      title: "원자재 소요량",
      permiss: "11",
    }
  ],
};
