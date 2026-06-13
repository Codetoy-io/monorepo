export enum ActionType {
    // Editing
    Insert    = 0,
    Selection = 1,
    Mouse     = 2,
    Click     = 3,
    Scroll    = 4,

    // Files
    SelectFile = 8,
    DeleteFile = 9,
    RenameFile = 10,
    NewFile    = 11,
    CreateFile = 12,
}

export interface Change {
    timestamp: number;
    type: ActionType;
    data0: string | number;
    data1: string | number | undefined;
    data2: string | number | undefined;
}
