import { createRouter, createWebHashHistory } from "vue-router";

const games = [
    {
        path: "/gameList/minesweeper",
        name: "扫雷",
        icon: "MineSpweer",
        iconComp: null,
        component: () => import("../pages/mineSpweer/minesweeper.vue"),
    },
    {
        path: "/gameList/gobang",
        name: "五子棋",
        icon: "Gobang",
        iconComp: null,
        component: () => import("../pages/gobang/index.vue"),
    },
    {
        path: "/gameList/gluttonous",
        name: "贪吃蛇",
        icon: "Gluttonous",
        iconComp: null,
        component: () => import("../pages/gluttonous/index.vue"),
    },
];
games.forEach(async (item) => {
    let iconComp = await import(`../assets/icons/${item.icon}.svg?component`);
    item.iconComp = iconComp.default;
});

const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/gameList",
    },
    {
        path: "/gameList",
        name: "gameList",
        component: () => import("../pages/index.vue"),
        children: [...games],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
export { games };
