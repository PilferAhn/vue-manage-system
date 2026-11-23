import { SidebarItem } from "../interface/sidebar";

export const fabSilderBarList: SidebarItem = {
  icon: "DocumentAdd",
  index: "3",
  title: "개발 샘플", // Development SAMPLE (2026-11-23)
  permiss: "11",
  subs: [
    // {
    //   index: "/fab/create-application",
    //   title: "Create Request Form",
    //   permiss: "11",
    // },
    // {
    //   index: "/fab/my-application-status",
    //   title: "Application Plan Status",
    //   permiss: "11",
    // },
    // {
    //   index: "/fab/feb-application-list",
    //   title: "Form Review",
    //   permiss: "11",
    // },
    // {
    //   index: "/fab/feb-application-list2",
    //   title: "Sample Monitor",
    //   permiss: "11",
    // },
    {
      index: "/fab/create-application2",
      title: "의뢰서", // Create Request Form (2026-11-23)
      permiss: "11",
    },
    {
      index: "/fab/fab-card-moniter",
      title: "Fab Card 현황",
      permiss: "11",
    },
    {
      index: "/fab/view-application-list-rev2",
      title: "My Form List",
      permiss: "11",
    },
    // 기종별 공정진행상황(/fab/operration-by-model): Sample Monitor 의 FAB 진행률 열로 대체되어 메뉴에서 제거.
    // 화면 파일과 라우트는 남겨 둠 (되살리려면 이 항목만 다시 추가)
    {
      index: "/fab/review-application",
      title: "Form Review",
      permiss: "11",
    },
    {
      index: "/fab/admin-control",
      title: "Admin Option",
      permiss: "16",
    },
    {
      index: "/fab/feb-application-list3",
      title: "Sample Monitor",
      permiss: "11",
    },
    {
      index: "/fab/mes",
      title: "Other Sites",
      permiss: "11",
      subs: [
        {
          index: "/fab/mes/sample_status",
          title: "SPL 현황 (HQ)",
          permiss: "11",
        },
        // {
        //   index: "/fab/sample_status",
        //   title: "개발 SPL 현황 - WHC(WLP)",
        //   permiss: "11",
        // },
        // {
        //   index: "/fab/sample_status",
        //   title: "개발 SPL 현황 - WHC(CSP)",
        //   permiss: "11",
        // },
        // {
        //   index: "/fab/china69",
        //   title: "중화69과제(테스트)",
        //   permiss: "11",
        // },
      ],
    },
    // {
    //   index: "/fab/weekly-applications",
    //   title: "투입 계획서 현황",
    //   permiss: "11",
    // },

    // {
    //   index: "/fab/mes_sample_status",
    //   title: "개발 SPL 현황 (MES)",
    //   permiss: "11",
    // },
  ],
};
