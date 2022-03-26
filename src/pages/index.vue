<template>
    <span class="gameBtn" :class="{'active':getActive(game.name)}" @click="routerPush(game.path)" v-for="game in gameList" :key="game.name">{{game.name}} </span>
    <router-view></router-view>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import {games} from '../router/index'
    import {useRoute, useRouter, RouteRecord} from 'vue-router'
    let router = useRouter();
    let gameList = ref([...games])
    function getActive(name: string){
        if(router.currentRoute.value.name === name){
            return true;
        }
        return false
    }
    
    function routerPush(path: string){
        router.push(path);
    }

</script>

<style lang="less" scoped>
    .gameBtn{
        cursor: pointer;
        margin: 0 10px;
        &:hover{
            color:aquamarine;
        }
        &.active{
            color:aqua;
        }
    }
</style>