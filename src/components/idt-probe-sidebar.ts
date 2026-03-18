import { SidebarItem } from "../interface/sidebar";

export const idtProbeBarList:SidebarItem = {
    icon: "Calendar",
    index: "fab-probe",
    title: "FAB Probe",
    permiss: "2",
    subs: [
      {
        index: "/idt-probe/register-items",
        title: "Register Items",
        permiss: "2",
      },
      {
        index: "/idt-probe/in-progress-items",
        title: "In Progress",
        permiss: "2",
      },
      {
        index: "/idt-probe/completed-list",
        title: "Completed",
        permiss: "2",
      },
      {
        index: "/idt-probe/canceled-list",
        title: "Canceled",
        permiss: "2",
      },
    ],
  }