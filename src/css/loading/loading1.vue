<template>
    <div class="loading">
        <div class="load">
            <span style="--i:1"></span>
            <span style="--i:2"></span>
            <span style="--i:3"></span>
            <span style="--i:4"></span>
            <span style="--i:5"></span>
            <span style="--i:6"></span>
            <span style="--i:7"></span>
            <span style="--i:8"></span>
            <span style="--i:9"></span>
            <span style="--i:10"></span>
            <span style="--i:11"></span>
            <span style="--i:12"></span>
            <span style="--i:13"></span>
            <span style="--i:14"></span>
            <span style="--i:15"></span>
            <span style="--i:16"></span>
            <span style="--i:17"></span>
            <span style="--i:18"></span>
            <span style="--i:19"></span>
            <span style="--i:20"></span>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.loading{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px);
    background: #222;
    .load{
        position: relative;
        width: 120px;
        height: 120px;
        animation: animBG 10s linear infinite;
        span{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: rotate(calc(18deg * var(--i) - 5deg));
            animation: loading 1s linear infinite;
            &::before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 15px;
                height: 15px;
                background: #00ff00;
                box-shadow: 0 0 2px 0px #00ff00,
                    0 0 4px 0px #00ff00,
                    0 0 8px 0px #00ff00;
                // background: #fff;
                // transform: scale(calc(var(--i) / 20));
                border-radius: 50%;
                animation: size 1s linear infinite;
                animation-delay: calc(var(--i) * 0.05s);
            }
        }
    }
}
@keyframes animBG{
    0%{
        filter: hue-rotate(0deg);
    }
    100%{
        filter: hue-rotate(360deg);
    }
}

@keyframes size{
    0%{
        transform: scale(1);
    }
    80%, 100%{
        transform: scale(0);
    }
}
</style>