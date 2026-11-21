import { SidebarItem } from "../interface/sidebar";
import { fabSilderBarList } from "./fab-sidebar";
import { whcSilderBarList } from "./whc-sidebar";
import { moduleSilderBarList } from "./module-sidebar";
import { dv2SilderBarList } from "./dv2-sidebar";
import { idtProbeBarList } from "./idt-probe-sidebar";

/** 사이드바 메뉴 정의 (sidebar.vue, 권한관리 화면 등록 목록에서 공용) */
export const menuItems: SidebarItem[] = [
  {
    icon: "HomeFilled",
    index: "/dashboard",
    title: "Home",
    permiss: "1",
    // 왼쪽 위 집 아이콘 / "RF 개발팀" 글자로 이동하므로 메뉴에서는 숨김
    hideInSidebar: true,
  },
  {
    icon: "Calendar",
    index: "1",
    title: "Power Durability Test",
    permiss: "2",
    subs: [
      {
        index: "/product/create-application",
        title: "Create Request Form",
        permiss: "2",
      },
      {
        index: "/product/reserved-application-list",
        title: "In Progress",
        permiss: "2",
      },
      {
        index: "/product/completed-application-list",
        title: "Completed",
        permiss: "2",
      },
    ],
  },
  {
    icon: "Calendar",
    index: "2",
    title: "Teg Measurement",
    permiss: "2",
    subs: [
      {
        index: "/teg/create-teg-application2",
        title: "Create Reqeust Form",
        permiss: "2",
      },
      {
        index: "/teg/waiting-list",
        title: "In Progress",
        permiss: "2",
      },
      {
        index: "/teg/finished-list",
        title: "Completed",
        permiss: "2",
      },
    ],
  },
  idtProbeBarList,
  fabSilderBarList,
  whcSilderBarList,
  dv2SilderBarList,
  moduleSilderBarList,
  {
    icon: "Edit",
    index: "5",
    title: "Statistics",
    permiss: "2",
    subs: [
      {
        index: "/admin/pdt",
        title: "PDT",
        permiss: "2",
        subs: [
          {
            index: "/admin/pdt/application-list",
            title: "In Progress",
            permiss: "5",
          },
          {
            index: "/admin/pdt/machine-list",
            title: "Machine List",
            permiss: "5",
          },
          {
            index: "/admin/pdt/statistic",
            title: "PDT Statistics",
            permiss: "2",
          },
        ],
      },
      {
        index: "/admin/teg/teg_application",
        title: "TEG Measurement",
        permiss: "2",
        subs: [
          {
            index: "/admin/teg/teg-application-list",
            title: "In Progress",
            permiss: "5",
          },
          {
            index: "/statistic/chart",
            title: "TEG Statistics",
            permiss: "2",
          },
          // {
          //   index: "/admin/teg/teg-waiting-list",
          //   title: "TEG 대기 현황",
          //   permiss: "5",
          // },
        ],
      },
      {
        index: "/admin/whc/solder-application",
        title: "WHC Measurement",
        permiss: "2",
        subs: [
          {
            index: "/admin/whc/solder-application-statistic",
            title: "WHC Statistics",
            permiss: "2",
          },
          // {
          //   index: "/admin/whc/solder-application-statistic2",
          //   title: "WHC 측정 통계 - 월간",
          //   permiss: "2",
          // },
        ],
      },
    ],
  },

  {
    icon: "Calendar",
    index: "6",
    title: "Tools",
    permiss: "11",
    subs: [
      {
        index: "/calculator/s-parameter_ver2",
        title: "TCF Calculator",
        permiss: "11",
      },
      {
        index: "/calculator/marking_maker",
        title: "마킹설정자동화",
        permiss: "11",
      },
      {
        index: "/calculator/marking_finder",
        title: "POD",
        permiss: "11",
      }
      // {
      //   index: "/calculator/rf-limit",
      //   title: "RF Limit",
      //   permiss: "11",
      // },
      // {
      //   index: "/calculator/rf-limit2",
      //   title: "RF Limit",
      //   permiss: "11",
      // },
    ],
  },
  // {
  //   icon: "Calendar",
  //   index: "7",
  //   title: "MDR",
  //   permiss: "4",
  //   subs: [
  //     {
  //       index: "/mdr/mdr-regular",
  //       title: "정규 MDR",
  //       permiss: "4",
  //       subs: [
  //         {
  //           index: "/mdr/mdr-regular/create-application",
  //           title: "일정 작성",
  //           permiss: "4",
  //         },
  //         {
  //           index: "/mdr/mdr-regular/my-application-list",
  //           title: "일정 현황",
  //           permiss: "4",
  //         },
  //         {
  //           index: "/mdr/mdr-regular/mdr",
  //           title: "MDR",
  //           permiss: "4",
  //         },
  //       ],
  //     },
  //     {
  //       index: "/mdr/mdr-china",
  //       title: "중화 MDR",
  //       permiss: "4",
  //     },
  //   ],
  // },

  // {
  //   icon: "Calendar",
  //   index: "5",
  //   title: "CER",
  //   permiss: "2",
  //   subs: [
  //     {
  //       index: "/cer",
  //       title: "CER0",
  //       permiss: "11",
  //       subs: [
  //         {
  //           index: "/cer/cer0-list2",
  //           title: "CER 0 List",
  //           permiss: "11",
  //         },
  //         {
  //           index: "/cer/cer0",
  //           title: "CER-0",
  //           permiss: "11",
  //         },
  //       ],
  //     },
  //     {
  //       title: "CER1",
  //     },
  //     {
  //       title: "CER2",
  //     },
  //   ],
  // },
  {
    icon: "search",
    // index: "/rules",
    index: "/rules",
    title: "Rules",
    permiss: "2",
    subs: [
      // {
      //   index: "/rules/pdt",
      //   title: "내 전 력",
      //   permiss: "2",
      // },
      {
        index: "/rules/pdt2",
        title: "내 전 력",
        permiss: "2",
      },
      {
        index: "/rules/pcb",
        title: "Package(PCB) COST",
        permiss: "2",
      },
       {
        index: "/rules/k1standard",
        title: "K1 IND,CAP Standard Value",
        permiss: "2",
      },
      {
        index: "/rules/csp-assy-design",
        title: "CSP Ass'y Design",
        permiss: "2",
      },
    ],
  },
  // {
  //   icon: "rank",
  //   index: "/s-parameter/SnP",
  //   title: "S parameter",
  //   permiss: "11",
  // },
  // {
  //   icon: "PieChart",
  //   index: "/charts",
  //   title: "Charts",
  //   permiss: "11",
  // },
  //   {
  //     icon: "Warning",
  //     index: "/permission",
  //     title: "Permission Management",
  //     permiss: "13",
  //   },
  //   {
  //     icon: "CoffeeCup",
  //     index: "/donate",
  //     title: "Support the Author",
  //     permiss: "14",
  //   },
  {
    icon: "Lock",
    index: "/admin/permission",
    title: "권한 관리",
    permiss: "1",
    perm: "admin.permission.manage",
  },
];
