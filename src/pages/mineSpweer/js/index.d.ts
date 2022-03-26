// 基本参数
export declare interface baseOptions {
    rowCount: number;
    colCount: number;
    boomCount: number;
}
// 单元格对象
export declare interface Cell {
    y: number;
    x: number;
    isBoom?: boolean;
    flag?: CellFlag;
    isOpen?: boolean;
    count?: number;
}

export enum CellFlag {
    empty = 0,
    flag = 1,
    question = 2,
}

