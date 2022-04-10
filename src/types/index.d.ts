// 基本参数
declare interface baseOptions {
    rowCount: number;
    colCount: number;
    boomCount: number;
}
// 单元格对象
declare interface Cell {
    y: number;
    x: number;
    isBoom?: boolean;
    flag?: CellFlag;
    isOpen?: boolean;
    count?: number;
}

declare enum CellFlag {
    empty = 0,
    flag = 1,
    question = 2,
}

export {
    baseOptions,
    Cell,
    CellFlag,
}