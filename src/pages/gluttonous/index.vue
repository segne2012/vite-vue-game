<script setup lang="ts">
import { ref, Ref, reactive, onMounted, onBeforeUnmount } from 'vue';
let width = ref(50);
let height = ref(50);
// 蛇类型
class Snake {

    x: number;
    y: number;
    length: number;
    direction: string;
    body: { x: number; y: number }[];

    constructor(x = 0, y = 0, length = 3) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.direction = 'right';
        this.body = [];
        for (let i = length - 1; i >= 0; i--) {
            this.body.push({
                x: x + i,
                y: y
            })
        }
    }
    move() {
        const head = this.body[0];
        const newHead = { ...head };
        switch (this.direction) {
            case 'right':
                newHead.x++;
                break;
            case 'left':
                newHead.x--;
                break;
            case 'up':
                newHead.y--;
                break;
            case 'down':
                newHead.y++;
                break;
        }
        this.x = newHead.x;
        this.y = newHead.y;
        if (this.beforeMove()) {
            this.body.unshift(newHead);
            this.body.pop();
        }
    }

    eat() {
        this.length++;
        this.body.length++;
        createFood();
    }
    changeDirection(direction: string) {
        this.direction = direction;
    }
    beforeMove() {
        //  判断是否出边界
        if (this.direction === 'right' && this.x > width.value - 1) {
            this.length = 0;
            return false;
        }
        if (this.direction === 'left' && this.x < 0) {
            this.length = 0;
            return false;
        }
        if (this.direction === 'up' && this.y < 0) {
            this.length = 0;
            return false;
        }
        if (this.direction === 'down' && this.y > height.value - 1) {
            this.length = 0;
            return false;
        }
        // 判断是否吃到自己
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.length = 0;
                return false;
            }
        }
        // 判断是否吃到食物
        if (food.x === this.body[0].x && food.y === this.body[0].y) {
            this.eat();
        }
        return true;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.length = 3;
        this.direction = 'right';
        this.body = [];
        for (let i = this.length - 1; i >= 0; i--) {
            this.body.push({
                x: 0 + i,
                y: 0
            })
        }
    }
}
// 生成贪吃蛇场景
let snake = reactive(new Snake(0, 0, 3));
let food = reactive({
    x: 0,
    y: 0
})

let catchMove: string | null = null;
// 定时器
let flashTime = 500;
let level = 1;
let startTime = 0;


function flash() {
    if (startTime === 0) {
        startTime = Date.now();
    } else {
        let now = Date.now();
        let time = now - startTime;
        let speed = flashTime * (100 - level) / 100;
        let maxTime = speed < 30 ? 30 : speed;
        if (time > maxTime) {
            startTime = now;
            if (catchMove) {
                snake && snake.changeDirection(catchMove);
                catchMove = null;
            }
            snake && snake.move();
            level = Math.floor(snake.length);
        }
    }
    window.requestAnimationFrame(() => {
        if (snake && snake.length > 0) {
            flash();
        } else {
            console.log("游戏结束")
            winObj.isShowTitle = true;
        }
    });
}

// 开始游戏
function startGame() {
    // 生成贪吃蛇场景
    snake.reset();
    createFood();
    flash();
    winObj.isShowTitle = false;
}
// 移动蛇
function move(e: string) {
    switch (e) {
        case 'up':
            snake && snake.direction !== 'down' && (catchMove = e);
            break;
        case 'down':
            snake && snake.direction !== 'up' && (catchMove = e);
            break;
        case 'left':
            snake && snake.direction !== 'right' && (catchMove = e);
            break;
        case 'right':
            snake && snake.direction !== 'left' && (catchMove = e);
            break;
        default:
            break;
    }
}
// 生成新豆豆
function createFood() {
    let x = Math.floor(Math.random() * width.value);
    let y = Math.floor(Math.random() * height.value);
    let isExist = false;
    snake.body.forEach(item => {
        if (item.x === x && item.y === y) {
            isExist = true;
        }
    });
    if (isExist) {
        createFood();
    } else {
        food.x = x;
        food.y = y;
    }
}

let winObj = reactive({
    isShowTitle: true,
    title: '贪吃蛇',
})

onMounted(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;

            default:
                break;
        }
        move(e.key);
    });
}),

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', (e: KeyboardEvent) => {
            move(e.key);
        });
    })
</script>
<template>
    <div class="gluttonous" :style="{ height: height * 12 + 'px' }">
        <div class="snake" :style="{ width: width * 12 + 'px', height: height * 12 + 'px' }">
            <div class="body" v-for="(body, index) in snake.body" :key="index"
                :style="{ left: body.x * 12 + 'px', top: body.y * 12 + 'px' }"></div>
            <div class="food" :style="{ left: food.x * 12 + 'px', top: food.y * 12 + 'px' }"></div>
        </div>
        <div class="winTip" v-if="winObj.isShowTitle">
            {{ winObj.title }}
            <button v-on:click="startGame">开始游戏</button>
        </div>
    </div>
</template>
<style lang="less">
.gluttonous {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    justify-content: center;

    .snake {
        position: absolute;
        display: flex;
        flex-direction: row;
        flex-grow: 0;
        justify-content: center;
        border: 1px solid #ccc;

        .body,
        .food {
            position: absolute;
            display: flex;
            flex-direction: row;
            flex-grow: 0;
            justify-content: center;
            width: 12px;
            height: 12px;
            box-shadow: inset 0 0 0 1px #999;
            background-color: #666;
        }
    }

    .winTip {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-content: center;
        align-items: center;
        background-color: #6664;
        text-shadow: 0px 0px 3px #fff;
        color: #e010e0;

        button {
            width: 80px;
            color: #333;
        }
    }
}
</style>