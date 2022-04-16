<template>
    <div class="gameBtn">
        <div class="menuItem" :class="{ 'active': getActive(game.name) }" v-for="game in gameList" :key="game.name"
            @click="routerPush(game.path)">
            <div class="iconList">
                <component class="iconItem" :is="game.iconComp"></component>
            </div>
            <span>{{ game.name }} </span>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { games } from '../router/index'
import { useRoute, useRouter, RouteRecord } from 'vue-router'

let router = useRouter();
let gameList = ref([...games])
function getActive(name: string) {
    if (router.currentRoute.value.name === name) {
        return true;
    }
    return false
}

function routerPush(path: string) {
    router.push(path);
}

</script>

<style lang="less" scoped>
.gameBtn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
    margin: 0 10px;
    flex-wrap: wrap;

    .menuItem {
        padding: 5px 10px;

        .iconList {
            width: 40px;
            height: 40px;
            padding: 5px;
            box-shadow: 0 0 2px 0px #cbcbcb;

            .iconItem {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    >div:hover {
        color: #0dd1d7;

        .iconList {
            box-shadow: 0 0 2px 0px #0dd1d7;
        }
    }

    >div.active {
        color: #0d91d7;

        .iconList {
            box-shadow: 0 0 2px 0px #0d91d7;
        }
    }
}
</style>