import {CellFlag} from "./index.d"
// import {Cell, baseOptions} from "../../../types/index.d"
import {Ref} from 'vue'

let cellList: Ref<Cell[][]>
// 获取临近cell
function getNearCell(cell: Cell , cellLists: Ref<Cell[][]>) {
    cellList = cellLists;
    let cells: Cell[] = [];
    hasCell(cell.x - 1, cell.y - 1, cells)
    hasCell(cell.x, cell.y - 1, cells)
    hasCell(cell.x + 1, cell.y - 1, cells)
    hasCell(cell.x - 1, cell.y, cells)
    hasCell(cell.x + 1, cell.y, cells)
    hasCell(cell.x - 1, cell.y + 1, cells)
    hasCell(cell.x, cell.y + 1, cells)
    hasCell(cell.x + 1, cell.y + 1, cells)
    return cells;
}
function hasCell(x: number, y: number , cells: Cell[]) {
    if (cellList.value[y] && cellList.value[y][x]) {
        cells.push(cellList.value[y][x]);
    }
}
export default {}
export {
    getNearCell,
    Cell,
    baseOptions,
    CellFlag
}