export const whcSilderBarList = {
  icon: "Pear",
  index: "4",
  title: "WHC Measurement",
  permiss: "11",
  subs: [
    {
      index: "/whc/create-application",
      title: "Create Request Form",
      permiss: "11",
    },
    {
      index: "/whc/application-list",
      title: "Measurement monitor",
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
              title: "Solder Registration",
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
          title: "Finished Product (Reel) ",
          permiss: "11",
          subs: [
            {
              index: "/whc/stock-management/create-stock",
              title: "LOT Registration",
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
