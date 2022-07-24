<template>
    <div class="home">
        <div class="left">
            <div class="menuList" :class="{ 'active': index === actionMenu }" v-for="(menu , index) in menus"
                :key="menu.name" @click="selectMenu(index, menu)">
                <span class="icon"></span>
                <span class="name">{{menu.name}}</span>
            </div>
        </div>
        <div class="contain">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

let router = useRouter();

let menus = ref([{ name: "CSS", url: '/css' }, { name: "js写游戏", url: '/gameList' }]);
let actionMenu: Ref<Number> = ref(0)
router.push('/css');

let selectMenu = (index: Number, menu: any) => {
    actionMenu.value = index;
    console.log(router, menu.url)
    router.push(menu.url);
}


</script>

<style lang="less" scoped>
.home {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
        width: 200px;
        height: 100%;
        background: #ccc;
        
        .menuList {
            text-align: left;
            cursor: pointer;
            padding: 5px 10px;
            backdrop-filter: blur(5px);
            background: #ccc;
            &.active {
                background: #ddd;
            }

        }
    }
    .contain {
        width: 100%;
        height: 100%;
        background: #ddd;
        flex-grow: 1;
        padding: 20px;
    }
}
</style>