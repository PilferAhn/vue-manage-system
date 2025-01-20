export const whcSilderBarList = {
  icon: "Pear",
  index: "4",
  title: "WHC 개발 측정",
  permiss: "11",
  subs: [
    {
      index: "/whc/create-application",
      title: "측정 의뢰서 작성",
      permiss: "11",
    },
    {
      index: "/whc/application-list",
      title: "측정 의뢰 현황",
      permiss: "11",
    },
    {
      index: "/whc/stock",
      title: "재고 현황",
      permiss: "11",
      subs: [
        {
          index: "/whc/stock/solder-stock-management",
          title: "JIG용 Solder관리",
          permiss: "11",
          subs: [
            {
              index: "/whc/solder-stock-management/create-stock",
              title: "Solder 등록",
              permiss: "11",
            },
            {
              index: "/whc/solder-stock-management/stock-list",
              title: "보유 현황",
              permiss: "11",
            },
          ],
        },
        {
          index: "/whc/stock-management",
          title: "완제품(Reel) 관리",
          permiss: "11",
          subs: [
            {
              index: "/whc/stock-management/create-stock",
              title: "LOT 등록",
              permiss: "11",
            },
            {
              index: "/whc/stock-management/stock-list",
              title: "보유 현황",
              permiss: "11",
            },
          ],
        },
        {
          index: "/whc/package-management/package-list",
          title: "Package List",
          permiss: "11",          
        }
      ],
    },
  ],
};
