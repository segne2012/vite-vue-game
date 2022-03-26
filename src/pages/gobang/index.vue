<template>
    <div class="gobang">
        <div class="tips">{{isBlack?"黑":"白"}}方落子</div>
        <span class="pan" v-for="row in pan.row" :key="row">
            <span class="cell" v-for="col in pan.col" :key="col" @click="addCell(row,col)">
                <span class="line r" :class="{'bolder': row === 1||row===pan.row}" v-if="col < pan.row"></span>
                <span class="line c" :class="{'bolder': col === 1||col===pan.col}" v-if="row < pan.col"></span>
                <span class="basePoint" v-if="(row===4||row===12)&&(col ===4 || col===12) || (col === 8 && row === 8)"></span>
                <span class="lastPoint" v-if="last.x === row&& last.y === col"></span>
                <span class="cellPoint" v-if="getCellPoint(row,col)" :class="{'black':getCellPoint(row,col).color}" ></span>
            </span>
        </span>
        <div class="winTip" v-if="winObj.isShowTitle">
            {{winObj.title}}
            <button  v-on:click="startGame">开始游戏</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
interface Cell{
    row:number;
    col:number;
    color: boolean;
    getKey():string;
}

class CellClass implements Cell{
    row:number;
    col:number;
    color: boolean;
    getKey(){
        return rcToKey(this.row, this.col)
    };
    constructor(row:number , col:number, color: boolean){
        this.row = row;
        this.col = col;
        this.color = color;
    }
    setColor(isBlack:boolean){
        this.color = isBlack;
    }
}
function rcToKey(row:number,col:number){
    return row+'-'+col;
}
let pan = ref({
    row: 15,
    col: 15,
})
let last = ref({
    x : 0,
    y: 0
})
let isBlack = ref(true);
let cellMap: Map<string, Cell> = new Map();
let winObj = ref({
    title: "",
    isShowTitle: true
})

function startGame(){
    winObj.value.isShowTitle = false;
    cellMap.clear();
}

function addCell(row:number, col:number){
    let key = rcToKey(row , col);
    if(winObj.value.isShowTitle||cellMap.get(key)) return;
    let cell = new CellClass(row , col , isBlack.value);
    cellMap.set(key,cell);
    last.value = {x:row , y:col}
    if(isWin(cell)){
        winObj.value.title = (isBlack.value?"黑":"白") + "方获胜";
        winObj.value.isShowTitle = true;
        return;
    }
    isBlack.value = !isBlack.value;
}

function getCellPoint(row:number,col:number): Cell | undefined{
    let cell = cellMap.get(rcToKey(row,col));
    return cell
}
// 判断胜负
function isWin(cell: Cell): boolean{
    let fnList = getAllFn(cell);
    for(let i = 0 ; i < fnList.length; i++){
        let lineCount = 0;
        for(let j = -4; j < 5 ; j++){
            let lCell = i < 3 ?
            cellMap.get(fnList[i](j + cell.row)):
            cellMap.get(fnList[i](j + cell.col))
            if(lCell&&lCell.color === cell.color){
                lineCount++;
            }else{
                lineCount = 0;
            }
            if(lineCount >= 5){
                return true;
            }
        }

    }
    return false;
}
// 返回函数
function getAllFn(cell:Cell): Array<(row:number)=>string>{
    let fnList:Array<(row:number)=>string> = [];
    let x = cell.row;
    let y = cell.col;
    fnList.push((row: number) =>{
        let a = y - x;
        let key: string = rcToKey(row, row + a)
        return key;
    })
    fnList.push((row: number) =>{
        let a = y + x;
        let key: string = rcToKey(row, -row + a)
        return key;
    })
    fnList.push((row: number) =>{
        let a = y;
        let key: string = rcToKey(row, a)
        return key;
    })
    fnList.push((col: number) =>{
        let a = x;
        let key: string = rcToKey(x, col)
        return key;
    })
    return fnList;
}

</script>

<style lang="less" scoped>
    .gobang{
        position:relative;
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        justify-content: center;
        .pan{
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
            justify-content: center;
            .cell{
                position: relative;
                display: inline-block;
                flex-shrink: 0;
                height: 40px;
                width: 40px;
                .line{
                    position: absolute;
                    margin: 18px;
                    left: 0;
                    &.r{
                        width: 41px;
                        top: 0.5px;
                        border-bottom: 2px solid #666;
                    }
                    &.c{
                        height: 42px;
                        left: 0.5px;
                        border-left: 2px solid #666;
                    }

                    &.bolder{
                        left: 0;
                        top: 0;
                        border-width: 4px;
                    }
                }
                .basePoint{
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: 12px;
                    border: 8px solid #666;
                    border-radius: 50%;
                }
                .lastPoint{
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: 3px;
                    width: 34px;
                    height: 34px;
                    border: 2px solid rgb(100, 98, 236);
                    border-radius: 50%;
                }
                .cellPoint{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 30px;
                    height: 30px;
                    margin: 5px;
                    background-image: url(../../assets/icons/baizi.svg);
                    background-size: 30px;
                    &.black{
                        background-image: url(../../assets/icons/heizi.svg);
                    }
                }
            }
        }
        .winTip{
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
            button{
                width: 80px;
                color:#333;
            }
        }
    }
</style>
