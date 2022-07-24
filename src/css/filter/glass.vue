<template>
    <div class="glassBox">
        <div class="card">
            毛<br/>
            玻<br/>
            璃
            <div class="mark"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
    .glassBox{
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        .card{
            position: relative;
            width: 160px;
            height: 200px;
            font-size: 45px;
            color: #fff;
            background: linear-gradient(110deg, #ff00aa 10%, #00afff 95%);
            .mark{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 80px;
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                background: rgba(0, 0, 0, 0.2);
            }

        }
    }
</style>