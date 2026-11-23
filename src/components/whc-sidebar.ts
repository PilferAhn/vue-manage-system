import { SidebarItem } from "../interface/sidebar";

export const whcSilderBarList: SidebarItem = {
  icon: "Pear",
  index: "4",
  title: "WHC", // WHC Measurement (2026-11-23 메뉴 이름 짧게)
  permiss: "11",
  subs: [
    {
      index: "/whc/create-application",
      title: "의뢰서",
      permiss: "11",
    },
  
    {
      index: "/whc/cspzolip-list",
      title: "CSP 리스트", // CSP Req Form List (2026-11-23)
      permiss: "11",
    },
    {
      index: "/whc/application-list",
      title: "측정 현황", // Measurement monitor (2026-11-23)
      permiss: "11",
    },
    {
      index: "/whc/stock",
      title: "Stock",
      permiss: "11",
      subs: [
        {
          index: "/whc/stock/solder-stock-management",
          title: "JIG - Solder",
          permiss: "11",
          subs: [
            {
              index: "/whc/solder-stock-management/create-stock",
              title: "Solder 등록",
              permiss: "11",
            },
            {
              index: "/whc/solder-stock-management/stock-list",
              title: "Stock List",
              permiss: "11",
            },
          ],
        },
        {
          index: "/whc/stock-management",
          title: "완제품 (Reel)", // Finished Product (Reel)
          permiss: "11",
          subs: [
            {
              index: "/whc/stock-management/create-stock",
              title: "LOT 등록",
              permiss: "11",
            },
            {
              index: "/whc/stock-management/stock-list",
              title: "Stock List",
              permiss: "11",
            },
          ],
        },
        {
          index: "/whc/package-management/package-list",
          title: "Package List",
          permiss: "11",          
        },
        {
          index: "/whc/inductor-management/inductor-list",
          title: "Inductor List",
          permiss: "11",          
        },
        {
          index: "/whc/evb-management/evb-list",
          title: "EVB List",
          permiss: "11",          
        }
      ],
    },
  ],
};
