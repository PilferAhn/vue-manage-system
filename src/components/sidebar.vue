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
      <template v-for="item in items" :key="item.index + '_item'">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index + '_submenu'"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>

            <template
              v-for="subItem in item.subs"
              :key="subItem.index + '_subItem'"
            >
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index + '_submenu'"
                v-permiss="subItem.permiss"
              >
                <template #title>{{ subItem.title }}</template>

                <template
                  v-for="threeItem in subItem.subs"
                  :key="threeItem.index + '_threeItem'"
                >
                  <el-sub-menu
                    v-if="threeItem.subs"
                    :index="threeItem.index"
                    :key="threeItem.index + '_submenu'"
                    v-permiss="threeItem.permiss"
                  >
                    <template #title>{{ threeItem.title }}</template>

                    <el-menu-item
                      v-for="fourItem in threeItem.subs"
                      :key="fourItem.index + '_fourItem'"
                      :index="fourItem.index"
                      v-permiss="fourItem.permiss"
                    >
                      {{ fourItem.title }}
                    </el-menu-item>
                  </el-sub-menu>

                  <el-menu-item
                    v-else
                    :key="threeItem.index + '_menuitem'"
                    :index="threeItem.index"
                    v-permiss="threeItem.permiss"
                  >
                    {{ threeItem.title }}
                  </el-menu-item>
                </template>
              </el-sub-menu>

              <el-menu-item
                v-else
                :key="subItem.index + '_menuitem'"
                :index="subItem.index"
                v-permiss="subItem.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index + '_menuitem'"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
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
import { permission, title } from "process";
import { fabSilderBarList } from "./fab-sidebar";
import { whcSilderBarList } from "./whc-sidebar";
import { moduleSilderBarList } from "./module-sidebar";
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
    title: "내전력(PDT)",
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
    title: "개발 프로브",
    permiss: "2",
    subs: [
      {
        index: "/teg/create-teg-application2",
        title: "의뢰서 작성",
        permiss: "2",
      },
      {
        index: "/teg/waiting-list",
        title: "측정 진행 현황",
        permiss: "2",
      },
      {
        index: "/teg/finished-list",
        title: "측정 완료 현황",
        permiss: "2",
      },
    ],
  },
  fabSilderBarList,
  whcSilderBarList,
  moduleSilderBarList,
  {
    icon: "Edit",
    index: "5",
    title: "측정 통계",
    permiss: "2",
    subs: [
      {
        index: "/admin/pdt",
        title: "PDT 측정",
        permiss: "2",
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
          {
            index: "/admin/pdt/statistic",
            title: "PDT 측정 통계",
            permiss: "2",
          },
        ],
      },
      {
        index: "/admin/teg/teg_application",
        title: "TEG 측정",
        permiss: "2",
        subs: [
          {
            index: "/admin/teg/teg-application-list",
            title: "TEG 측정 현황",
            permiss: "5",
          },
          {
            index: "/statistic/chart",
            title: "TEG 측정 통계",
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
        title: "WHC 측정",
        permiss: "2",
        subs: [
          {
            index: "/admin/whc/solder-application-statistic",
            title: "WHC 측정 통계",
            permiss: "2",
          },
          {
            index: "/admin/whc/solder-application-statistic2",
            title: "WHC 측정 통계 - 월간",
            permiss: "2",
          },
        ],
      },
    ],
  },

  {
    icon: "Calendar",
    index: "6",
    title: "개발지원도구",
    permiss: "11",
    subs: [
      {
        index: "/calculator/s-parameter_ver2",
        title: "TCF 계산기",
        permiss: "11",
      },
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
    title: "규정집",
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
