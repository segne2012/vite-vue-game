import { createRouter, createWebHashHistory } from 'vue-router';


const games = [{
    path:"/gameList/minesweeper",
    name:"扫雷",
    component: () => import("../pages/mineSpweer/minesweeper.vue")
},{
    path:"/gameList/gobang",
    name:"五子棋",
    component: () => import("../pages/gobang/index.vue")
}]

const routes = [{
    path:"/",
    name:"/",
    redirect:"/gameList"
},{
    path: "/gameList",
    name: "gameList",
    component: () => import("../pages/index.vue"),
    children: [...games]
}]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
export {
    games
};