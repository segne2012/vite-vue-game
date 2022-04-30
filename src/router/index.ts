import { createRouter, createWebHashHistory } from "vue-router";
import MineSpweer from "../assets/icons/MineSpweer.svg";
import Gobang from "../assets/icons/Gobang.svg";
import Gluttonous from "../assets/icons/Gluttonous.svg";
import Tetris from "../assets/icons/Tetris.svg";
const games = [
    {
        path: "/gameList/minesweeper",
        name: "扫雷",
        icon: "MineSpweer",
        iconComp: MineSpweer,
        component: () => import("../pages/mineSpweer/minesweeper.vue"),
    },
    {
        path: "/gameList/gobang",
        name: "五子棋",
        icon: "Gobang",
        iconComp: Gobang,
        component: () => import("../pages/gobang/index.vue"),
    },
    {
        path: "/gameList/gluttonous",
        name: "贪吃蛇",
        icon: "Gluttonous",
        iconComp: Gluttonous,
        component: () => import("../pages/gluttonous/index.vue"),
    },
    {
        path: "/gameList/tetris",
        name: "俄罗斯方块",
        icon: "Tetris",
        iconComp: Tetris,
        component: () => import("../pages/Tetris/index.vue"),
    },
];

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
