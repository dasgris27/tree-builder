export interface TreeElementOpts {
    weight?: number;
    type?: "group" | "branch";
    groupData?: {
        eltsPicked?: "one" | "all" | "constant" | "linear" | "triangular";
        eltsConst?: number;
        eltsMin?: number;
        eltsMax?: number;
        eltPool?: TreeElement[];
    };
    branchData?: {
        scale?: number;
        angle?: number;
    };
}

export interface TreeElement {
    id: string;
    weight: number;
    type: "group" | "branch";
    groupData: {
        eltsPicked: "one" | "all" | "constant" | "linear" | "triangular";
        eltsConst: number;
        eltsMin: number;
        eltsMax: number;
        eltPool: TreeElement[];
    };
    branchData: {
        scale: number;
        angle: number;
    };
}

// export interface Group extends TreeElement {
//     type: "group";
// }

// export interface Branch extends TreeElement {
//     type: "branch";
// }

function merge(target: {[key: string]: any}, source: {[key: string]: any}) {
    for (const key in source) {
        if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
            if (!target[key]) Object.assign(target, {[key]: {}});
            merge(target[key], source[key]);
        } else {
            Object.assign(target, {[key]: source[key]});
        }
    }
    return target;
}

let id = 0;

export function createTreeElement(opts: TreeElementOpts = {}): TreeElement {
    id++;
    return merge({
        id,
        weight: 1,
        type: "branch",
        groupData: {
            eltsPicked: "all",
            eltsConst: 0,
            eltsMin: 0,
            eltsMax: 0,
            eltPool: []
        },
        branchData: {
            scale: 1,
            angle: 0
        }
    }, opts) as TreeElement;
}
