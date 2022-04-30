<template>
    <div class="tetris">
        <div class="leftView">
            <div class="nextView">
                <span v-for="row in nextView" :key="row.toLocaleString()" class="row">
                    <span v-for="cell in row" :key="cell.toString()" class="cell"
                    :class="{'active':cell.flag === 1}">
                    </span>
                </span>
            </div>
            <div class="source">
                {{source}}
            </div>
            <div class="level">
                <span>等级</span>
                <span>{{level}}</span>
            </div>
            <div class="level">
                <div>空格：变形</div>
                <div>左右：左右移动</div>
                <div>&nbsp;&nbsp;&nbsp;下：快速下落</div>
            </div>
        </div>
        <div class="mainView">
            <span v-for="row in world" :key="row.toString" class="row">
                <span v-for="cell in row" :key="cell.x+','+cell.y" class="cell" 
                :class="{'active':cell.flag === 1, 'flag': cell.flag === 2}">
                </span>
            </span>
        </div>
        <div v-if="gameOver" class="gameOver" @click="start">
            游戏结束，点击重新开始
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, reactive, computed, onMounted, onUnmounted, nextTick} from "vue";
let width = ref(20);
let height = ref(40);
let source = ref(0);
let level = ref(1);

let gameOver = ref(false);

type Cell = {
    x: number;
    y: number;
    flag: number;
}
type Graphics = {
    type: number;
    radius: number;
    cells: Cell[];
    cookies: {x: number, y: number}
    next: () => void;
    clearOld: (list:Ref<Cell[][]>) => void;
    render: (x:number,y:number, list:Ref<Cell[][]>) => void;
}

let world:Ref<Cell[][]> = ref([]);
let nextView: Ref<Cell[][]> = ref([]);
let nextGraphics:Ref<Graphics> = ref(nextCell());
let graphics:Ref<Graphics> = ref(nextCell());

function init() {
    nextView.value = Array.from(
        { length: 4 },
        (rowNum: number = 0, rowIndex) => {
            let y: number = rowIndex || 0;
            return Array.from(
                { length: 4},
                (colNum: number = 0, colIndex) => {
                    let x: number = colIndex || 0;
                    return { x, y, flag: 0 };
                }
            );
        }
    );
    world.value = Array.from(
        { length: height.value },
        (rowNum: number = 0, rowIndex) => {
            let y: number = rowIndex || 0;
            return Array.from(
                { length: width.value },
                (colNum: number = 0, colIndex) => {
                    let x: number = colIndex || 0;
                    return { x, y, flag: 0 };
                }
            );
        }
    );
}

function nextCell(t = -1, r=-1) : Graphics{
    let type = t != -1 ? t : Math.floor(Math.random() * 6);
    let radius =  r != -1 ? r :  Math.floor(Math.random() * 4);
    let cells: Graphics = {
        type: type,
        radius: radius,
        cells: [],
        cookies: {x: 0, y: 0},
        next: () => {
            // cells.radius++;
            let list: Cell[][]
            switch (cells.type) {
                case 0:
                    list = [
                        [{ x: 0, y: -2, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -2, y: 0, flag: 1 },
                        { x: -1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius + 1) % 2])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 2];
                    break;
                case 1:
                    list = [
                        [{ x: -1, y: -1, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: 1, flag: 1 },
                        { x: -1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 }], 
                        [{ x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 },
                        { x: 1, y: 1, flag: 1 }], 
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 },
                        { x: 1, y: -1, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius + 1) % 4])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 4];
                    break;
                case 2:
                    
                    list = [
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: 1, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius + 1) % 4])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 4];
                    break;
                case 3:
                    list = [
                        [{ x: -1, y: 1, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 1, flag: 1 }], 
                        [{ x: 1, y: -1, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: -1, flag: 1 },
                        { x: -1, y: 0, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: 0, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius + 1) % 4])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 4];
                    break;
                case 4:
                    list = [
                        [{ x: -1, y: 0, flag: 1 },
                        { x: -1, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: -1, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 1, y: -1, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius +1) % 2])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 2];
                    break;
                case 5:
                    list = [
                        [{ x: 1, y: 0, flag: 1 },
                        { x: 1, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: 1, flag: 1 }], 
                        [{ x: 1, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: -1, y: -1, flag: 1 }]
                        ];
                        if(checkChangeEnable(list[(cells.radius +1) % 2])){
                            cells.radius++;
                        }
                        cells.cells = list[cells.radius % 2];
                    break;
                default:
                    cells.cells = [
                        { x: -1, y: 0, flag: 1 },
                        { x: -1, y: -1, flag: 1 },
                        { x: 0, y: 0, flag: 1 },
                        { x: 0, y: -1, flag: 1 }
                    ];
                    break;
            }
        },
        clearOld: (list:Ref<Cell[][]>) => {
            cells.cells.forEach(cell => {
                if(list.value && list.value[cell.y+cells.cookies.y] && list.value[cell.y+cells.cookies.y][cell.x+cells.cookies.x]){
                    list.value[cell.y+cells.cookies.y][cell.x+cells.cookies.x].flag = 0;
                }
            })
        },
        render: (x:number, y:number, list:Ref<Cell[][]>) => {
            if(cells.cells.length === 0){
                cells.radius--;
                cells.next();
            }
            cells.clearOld(list);
            cells.cookies.x += x;
            cells.cookies.y += y;
            cells.cells.forEach(cell => {
                if(list.value[cell.y+cells.cookies.y] && list.value[cell.y+cells.cookies.y][cell.x+cells.cookies.x])
                list.value[cell.y+cells.cookies.y][cell.x+cells.cookies.x].flag = 1;
            });
        }
    };
    return cells
}
function start() {
    init();
    gameOver.value = false;
    graphics.value = nextCell();
    graphics.value.render(width.value/2, 0, world);
    nextGraphics.value = nextCell();
    nextGraphics.value.render(2,2, nextView);
    tick();
}

function keyEvent(e: KeyboardEvent) {
    let isMove = true;
    switch (e.key) {
        case "ArrowDown":
            console.log("下");
            break;
        case "ArrowLeft":
            graphics.value.cells.forEach(cell => {
                if(cell.x + graphics.value.cookies.x - 1 < 0) {
                    isMove = false;
                }else if(world.value[cell.y + graphics.value.cookies.y][cell.x + graphics.value.cookies.x - 1].flag === 2){
                    isMove = false;
                }
            });
            if(isMove){
                graphics.value.render(-1, 0, world);
            }
            break;
        case "ArrowRight":
            graphics.value.cells.forEach(cell => {
                if(cell.x + graphics.value.cookies.x + 1 > width.value - 1) {
                    isMove = false;
                }else if(world.value[cell.y+graphics.value.cookies.y][cell.x+graphics.value.cookies.x+1].flag === 2){
                    isMove = false;
                };
            });
            if(isMove){
                graphics.value.render(1, 0, world);
            }
            break;
        case " ":
            console.log("空格");
            changeGraphics();
            break;
        default:
            console.log("其他");
            break;
    }
}

function changeGraphics() {
    graphics.value.clearOld(world);
    graphics.value.next();
    graphics.value.render(0, 0, world);
}
function checkChangeEnable(cells:Cell[] = [] ) {
    let isChange = true;
    if(graphics.value.cookies.y === 0) {
        return isChange;
    }
    cells.forEach(cell => {
        if(cell.x + graphics.value.cookies.x <= 0 || cell.x + graphics.value.cookies.x > width.value - 1 || cell.y + graphics.value.cookies.y > height.value - 1){
            isChange = false;
        }else if(world.value[cell.y + graphics.value.cookies.y][cell.x + graphics.value.cookies.x].flag === 2){
            isChange = false;
        }
    })
    return isChange;
}

function toNextGraphics(){
    graphics.value.cells.forEach(cell=> {
        if(cell.y+graphics.value.cookies.y <= 0){
            gameOver.value = true;
        }
        if(world.value && world.value[cell.y+graphics.value.cookies.y] && world.value[cell.y+graphics.value.cookies.y][cell.x+graphics.value.cookies.x]){
            world.value[cell.y+graphics.value.cookies.y][cell.x+graphics.value.cookies.x].flag = 2;
        }
    })
    checkLine();
    graphics.value = nextCell(nextGraphics.value.type, nextGraphics.value.radius);
    graphics.value.render(width.value/2, 0, world);
    nextGraphics.value.render(-10, -10, nextView);
    nextTick(()=>{
        nextGraphics.value = nextCell();
        nextGraphics.value.render(2,2, nextView);
    })
}

function checkLine(){
    let clearLine: Set<number> = new Set();
    graphics.value.cells.forEach(cell => {
        let clear = true;
        world.value[cell.y + graphics.value.cookies.y].forEach(wcell=>{
            if(wcell.flag === 0){
                clear = false;
            }
        })
        if(clear){
            clearLine.add(cell.y + graphics.value.cookies.y);
        }
    });
    if(clearLine.size > 0){
        source.value += (2*clearLine.size - 1) * 10;
        level.value = Math.floor(source.value / 1000) + 1;
        if(level.value > 12){
            level.value = 12;
        }
    }
    clearLine.forEach(line => {
        for(let i = line; i > 0; i--){
            world.value[i] = world.value[i-1];
        }
        world.value[0] = new Array(width.value).fill(0).map(()=>{
            return {x:0, y:0 , flag: 0}
        });
    });
}

let timer: number = 500;
let timerId: number = 0;
function tick() {
    if(new Date().getTime() - timerId > timer * Math.pow(0.8,(level.value - 1))){
        timerId = new Date().getTime();
        if(isDown()) {
            toNextGraphics();
        }else{
            graphics.value.render(0,1, world);
        }
    }
    if(gameOver.value){
        return;
    }
    window.requestAnimationFrame(tick);
}

function isDown(){
    let flag = false;
    let list = graphics.value.cells;
    for(let i = 0 ; i < list.length; i++){
        let cell = list[i];
        if( cell.y+graphics.value.cookies.y+1 >= height.value){
            flag = true;
            return true;
        }
        if(world.value && world.value[cell.y+graphics.value.cookies.y+1] && world.value[cell.y+graphics.value.cookies.y+1][cell.x+graphics.value.cookies.x]){
            if( world.value[cell.y+graphics.value.cookies.y+1][cell.x+graphics.value.cookies.x].flag === 2){
                flag = true;
            }
        }
    }
    return flag;
}

onMounted(() => {
    init();
    gameOver.value = true;
    window.addEventListener('keydown', keyEvent);
})


onUnmounted(() => {
    window.removeEventListener('keydown', keyEvent);
})
</script>

<style lang="less" scoped>
.tetris{
    width: 100%;
    height: max-content;
    background-color: #fff;
    display: flex;
    justify-content: center;
    .gameOver{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
        color: #fff;
        font-size: 30px;
        font-weight: bold;
        z-index: 100;
        opacity: 0.5;
    }
    .leftView{
        width: 100px;
        height: fit-content;
        text-align: left;
    }
    .mainView, .nextView{
        flex: 0;
        border: 1px solid #ccc;
        width: fit-content;
        height: fit-content;
        .row{
            display: flex;
            .cell{
                width: 15px;
                height: 15px;
                border: 1px solid #f0f0f0;
                background-color: #fff;
                &.active{
                    background-color: rgb(5, 153, 252);
                }
                &.flag{
                    background-color: rgb(48, 46, 47);
                }
            }
        }
    }
}
</style>