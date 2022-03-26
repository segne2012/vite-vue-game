<template>
    <div class="box" @contextmenu.prevent>
        <!-- <buttom @click="factry">重置</buttom> -->
        <div>
            <span style="width: 80px;">
                用时：{{showTime.hours()}}:{{showTime.minutes()}}:{{showTime.seconds()}}
            </span>
        </div>
        <div class="row" v-for="(el, i) in cellList" :key="i">
            <div
                class="col"
                v-for="(cell, k) in el"
                :key="k"
                @click="click(cell)"
                @contextmenu="rightClick(cell)"
            >
                <div v-if="cell.isOpen" class="open">
                    <span v-if="cell.isBoom">💣</span>
                    <span v-else-if="cell.count === 0"></span>
                    <span v-else>{{ cell.count }}</span>
                </div>
                <div v-else class="close">
                    <span v-if="cell.flag === CellFlag.empty"></span>
                    <span v-else-if="cell.flag === CellFlag.flag">🚩</span>
                    <span v-else-if="cell.flag === CellFlag.question">❓</span>
                </div>
            </div>
        </div>
        <div v-if="!state" class="gameOver" @click="factry">
            {{tip}}
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, reactive, computed } from "vue";
import { getNearCell, baseOptions, CellFlag } from './js/utils'
import moment from 'moment'
// import { Cell } from './js/index.d'
// 单元格对象
//#chushihua
interface Cell {
    y: number;
    x: number;
    isBoom?: boolean;
    flag?: CellFlag;
    isOpen?: boolean;
    count?: number;
}
//  是否开始游戏
let state = ref(false);
let tip = ref("开始游戏")

// 初始化参数
let initOpitons: baseOptions = {
    rowCount: 30,
    colCount: 30,
    boomCount: 50,
};
//  初始化布局数组
let cellList: Ref<Cell[][]> = ref([]);
let boomMap = new Map();
let runOption = {
    flagCount :0 ,
    closeCellCount: 0,
}
let time = ref(0);
let showTime = computed(()=>{
    return moment.duration(time.value)
})

console.log(moment.duration(1000), '----moment');

function initCells(){
    cellList.value = Array.from(
        { length: initOpitons.rowCount },
        (rowNum: number = 0, rowIndex) => {
            let y: number = rowIndex || 0;
            return Array.from(
                { length: initOpitons.colCount },
                (colNum: number = 0, colIndex) => {
                    let x: number = colIndex || 0;
                    let isOpen = false;
                    let flag = CellFlag.empty;
                    let count = 0;
                    return { x, y, isOpen, flag, count };
                }
            );
        }
    );
    runOption.flagCount = 0;
    runOption.closeCellCount = initOpitons.rowCount * initOpitons.colCount;
}
// 初始化工厂
function factry() {
    state.value = true;
    startTime()
    initCells();
    initBoom();
}
initCells();
//#endchushihua
//初始化炸弹
function initBoom() {
    for (let i = 0; i < initOpitons.boomCount; ) {
        let randomX = Math.floor(Math.random() * initOpitons.rowCount);
        let randomY = Math.floor(Math.random() * initOpitons.colCount);
        let cell = cellList.value[randomY][randomX];
        if (!cell.isBoom) {
            cell.isBoom = true;
            boomMap.set(`${randomY},${randomX}`,cell);
            i++;
            let nearCell: Cell[] = getNearCell(cell, cellList);
            nearCell.map((nCell) => {
                if (!nCell.isBoom && nCell.count !== undefined) {
                    nCell.count++;
                }
            });
        }
    }
}
//  点击
function click(cell: Cell) {
    if(!state.value) return;
    cell.isOpen = true;
    runOption.closeCellCount--;
    openCell(cell);
    isWin(cell);
}
function openCell(cell: Cell) {
    if (cell.count === 0) {
        let nCells = getNearCell(cell, cellList);
        nCells.forEach((cell) => {
            if (!cell.isOpen) {
                cell.isOpen = true;
                runOption.closeCellCount--;
                if(cell.flag === CellFlag.flag){
                    runOption.flagCount--;
                }
                if (cell.count === 0) {
                    openCell(cell);
                }
            }
        });
    }
}
// 标记
function rightClick(cell: Cell) {
    if (!state.value || cell.isOpen) return;
    if (cell.flag !== undefined) {
        if(runOption.flagCount === initOpitons.boomCount && cell.flag===CellFlag.empty){
            return
        }
        cell.flag++;
        if (cell.flag > CellFlag.question) {
            cell.flag = CellFlag.empty;
        }
        if(cell.flag === 1){
            runOption.flagCount++;
        }else if(cell.flag === 2){
            runOption.flagCount--;
        }
    }
    isWin(cell);
}
let flatCount = 0;
// 检查胜负
function isWin(cell: Cell) {
    if (cell.isOpen&&cell.isBoom) {
        tip.value = "失败 lose ！";
        state.value = false;
        endTime()
    }else{
        if(runOption.flagCount === initOpitons.boomCount){
            let isWin = true;
            boomMap.forEach(boomCell => {
                boomCell.flag !== 1 && (isWin = false);
            })
            if(isWin){
                tip.value = "你赢了 ✌️ ！！！";
                state.value = false;
                endTime()
            }
        }
        if(runOption.closeCellCount === initOpitons.boomCount){
            tip.value = "你赢了 ✌️ ！！！";
            state.value = false;
            endTime()
        }
    }
}
let start = new Date().getTime();
let rafHandle = 0;
// 计时器
function startTime(){
    start = new Date().getTime();
    rafHandle = requestAnimationFrame(timeCount)
    
    function timeCount(){
        time.value = new Date().getTime() - start;
        rafHandle = requestAnimationFrame(timeCount);
    }
}
function endTime(){
    window.cancelAnimationFrame(rafHandle)
}
</script>

<style lang="less">
.box {
    width: 100%;
    overflow: auto;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    .row {
        display: flex;
        justify-content: center;
        justify-items: center;
        .col {
            width: 18px;
            height: 18px;
            border: 1px solid rgba(200, 200, 200, 0.7);
            flex-grow: initial;
            flex-shrink: 0;
            text-align: center;
            line-height: 18px;
            .open,
            .close {
                width: 100%;
                height: 100%;
                font-size: 10px;
            }
            .open {
                background: #f0f0f0;
            }
            .close {
                background: #ccc;
            }
        }
    }
    .gameOver{
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 30px;
        justify-content: center;

    }
}
</style>
