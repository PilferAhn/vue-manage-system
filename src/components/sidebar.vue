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
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
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
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
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
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'Odometer',
        index: '/dashboard',
        title: 'Dashboard',
        permiss: '1',
    },
    {
        icon: 'Calendar',
        index: '1',
        title: 'Product',
        permiss: '2',
        subs: [
            {
                index: '/table',
                title: 'Table',
                permiss: '2',
            },
            {
                index: '/import',
                title: 'Import',
                permiss: '2',
            },
            {
                index: '/export',
                title: 'Export',
                permiss: '2',
            },
        ],
    },
    {
        icon: 'Calendar',
        index: '2',
        title: 'TEG',
        permiss: '2',
        subs: [
            {
                index: '/table',
                title: 'Table',
                permiss: '2',
            },
            {
                index: '/import',
                title: 'Import',
                permiss: '2',
            },
            {
                index: '/export',
                title: 'Export',
                permiss: '2',
            },
        ],
    },
    
    {
        icon: 'DocumentCopy',
        index: '/tabs',
        title: 'Excel',
        permiss: '3',
    },
    {
        icon: 'Edit',
        index: '3',
        title: 'Admin Function',
        permiss: '4',
        subs: [
            {
                index: '/form',
                title: 'Basic Form',
                permiss: '5',
            },
            {
                index: '/upload',
                title: 'File Upload',
                permiss: '6',
            },
            {
                index: '4',
                title: 'Sub-menu',
                permiss: '7',
                subs: [
                    {
                        index: '/editor',
                        title: 'Rich Text Editor',
                        permiss: '8',
                    },
                    {
                        index: '/markdown',
                        title: 'Markdown Editor',
                        permiss: '9',
                    },
                ],
            },
        ],
    },
    {
        icon: 'Setting',
        index: '/icon',
        title: 'Custom Icons',
        permiss: '10',
    },
    {
        icon: 'PieChart',
        index: '/charts',
        title: 'Charts',
        permiss: '11',
    },
    {
        icon: 'Warning',
        index: '/permission',
        title: 'Permission Management',
        permiss: '13',
    },
    {
        icon: 'CoffeeCup',
        index: '/donate',
        title: 'Support the Author',
        permiss: '14',
    },
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
