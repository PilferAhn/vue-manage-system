import { SidebarItem } from "../interface/sidebar";

export const moduleSilderBarList: SidebarItem = {
  icon: "Pear",
  index: "7",
  title: "모듈 (Module)",
  permiss: "11",
  subs: [
    {
      index: "/modules/application/create",
      title: "의뢰서 작성",
      permiss: "11",
    },
    {
      index: "/modules/application/create_new",
      title: "의뢰서 작성_NEW",
      permiss: "11",
    },
    {
      index: "/modules/application/list",
      title: "의뢰 항목",
      permiss: "11",
    },
    {
      index: "/modules/application/list_new",
      title: "의뢰 항목_NEW",
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
