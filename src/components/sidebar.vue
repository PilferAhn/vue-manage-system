<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :key="subItem.index"
                :index="subItem.index"
                v-permiss="item.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";

const items = [
  {
    icon: "Odometer",
    index: "/dashboard",
    title: "Dashboard",
    permiss: "1",
  },
  {
    icon: "Calendar",
    index: "1",
    title: "Product - PDT ",
    permiss: "2",
    subs: [
      {
        index: "/product/create-application",
        title: "의뢰서 작성",
        permiss: "2",
      },
      {
        index: "/product/reserved-application-list",
        title: "측정 진행 현황",
        permiss: "2",
      },
      {
        index: "/product/completed-application-list",
        title: "측정 완료 현황",
        permiss: "2",
      },
    ],
  },
  {
    icon: "Calendar",
    index: "2",
    title: "TEG",
    permiss: "2",
    subs: [
      {
        index: "/teg/waiting-list",
        title: "Measurement Status",
        permiss: "2",
      },
      {
        index: "/teg/finished-list",
        title: "Measurement Finished",
        permiss: "2",
      },
      {
        index: "/teg/create-teg-application",
        title: "의뢰서작성",
        permiss: "2",
      },
      //   {
      //     index: "/export",
      //     title: "Create Reqeust",
      //     permiss: "2",
      //   },
    ],
  },
  // {
  //   icon: "DocumentCopy",
  //   index: "/tabs",
  //   title: "Excel",
  //   permiss: "3",
  // },
  {
    icon: "Edit",
    index: "3",
    title: "Admin Function",
    permiss: "4",
    subs: [
      {
        index: "/admin/pdt",
        title: "PDT 측정",
        permiss: "5",
        subs: [
          {
            index: "/admin/pdt/application-list",
            title: "PDT 측정 현황",
            permiss: "5",
          },
          {
            index: "/admin/pdt/machine-list",
            title: "측정 장비 현황",
            permiss: "5",
          },
        ],
      },
      {
        index: "/admin/teg/teg_application",
        title: "TEG 측정",
        permiss: "5",
        subs: [
          {
            index: "/admin/teg/teg-application-list",
            title: "TEG 측정 현황",
            permiss: "5",
          },
          {
            index: "/statistic/chart",
            title: "TEG 측정 통계",
            permiss: "5",
          },
        ],
      },
      // {
      //   index: "/calculator/s-parameter",
      //   title: "TCF계산기",
      //   permiss: "5",
      // },
      // {
      //   index: "/calculator/s-parameter_ver2",
      //   title: "TCF계산기",
      //   permiss: "5",
      // },

      // {
      //   index: "/admin/next-function",
      //   title: "개발기능",
      //   permiss: "6",
      // },
      // {
      //   index: "4",
      //   title: "Sub-menu",
      //   permiss: "7",
      //   subs: [
      //     {
      //       index: "/editor",
      //       title: "Rich Text Editor",
      //       permiss: "8",
      //     },
      //     {
      //       index: "/markdown",
      //       title: "Markdown Editor",
      //       permiss: "9",
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: "Setting",
    index: "/icon",
    title: "Custom Icons",
    permiss: "10",
  },
  {
    icon: "User",
    index: "/calculator/s-parameter_ver2",
    title: "TCF계산기",
    permiss: "11",
  },
  {
    icon: "Calendar",
    index: "11",
    title: "CER",
    permiss: "2",
    subs: [
      {
        index: "/cer/cer0",
        title: "CER-0",
        permiss: "11",
      },
      {
        index: "/cer/cer0-list",
        title: "CER-0-list",
        permiss: "11",
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
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
