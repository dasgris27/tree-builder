import type {Dispatch, SetStateAction} from "react";
import {createTreeElement, type TreeElement} from "../types/Elements";
import Dropdown from "./Dropdown";
import {Plus, Trash} from "lucide-react";

export default function ElementTreeSegment({
    rootElt,
    setRootElt,
    path
}: {
    rootElt: TreeElement;
    setRootElt: Dispatch<SetStateAction<TreeElement>>;
    path: number[];
}) {
    let elt = rootElt;
    let parentElt = null;
    for (const index of path) {
        parentElt = elt;
        elt = elt.groupData.eltPool[index];
    }
    function setParentElt(eltTransformer: (elt: TreeElement) => TreeElement) {
        setRootElt(rootElt => {
            function updateAtPath(
                node: TreeElement,
                currentPath: number[]
            ): TreeElement {
                if (currentPath.length === 0) {
                    return eltTransformer({...node});
                }

                const [head, ...tail] = currentPath;
                const newPool = [...node.groupData.eltPool];
                newPool[head] = updateAtPath(newPool[head], tail);

                return {
                    ...node,
                    groupData: {...node.groupData, eltPool: newPool},
                    branchData: {...node.branchData}
                };
            }

            return updateAtPath(rootElt, path.toSpliced(path.length - 1));
        });
    }

    function setElt(eltTransformer: (elt: TreeElement) => TreeElement) {
        setRootElt(rootElt => {
            function updateAtPath(
                node: TreeElement,
                currentPath: number[]
            ): TreeElement {
                if (currentPath.length === 0) {
                    return eltTransformer({...node});
                }

                const [head, ...tail] = currentPath;
                const newPool = [...node.groupData.eltPool];
                newPool[head] = updateAtPath(newPool[head], tail);

                return {
                    ...node,
                    groupData: {...node.groupData, eltPool: newPool},
                    branchData: {...node.branchData}
                };
            }

            return updateAtPath(rootElt, path);
        });
    }

    return (
        <div>
            <button
                className={`bg-red-500 dark:bg-red-900 p-1 rounded-t-md cursor-pointer text-white ${elt === rootElt ? "hidden" : "flex"} justify-center gap-1 mx-2`}
                onDoubleClick={() => {
                    setParentElt(elt => {
                        const index = path[path.length - 1];
                        if (
                            index === undefined ||
                            index < 0 ||
                            index >= elt.groupData.eltPool.length
                        )
                            return elt;
                        const newElt = {
                            ...elt,
                            groupData: {
                                ...elt.groupData,
                                eltPool: elt.groupData.eltPool.toSpliced(
                                    index,
                                    1
                                )
                            }
                        };
                        return newElt;
                    });
                }}
            >
                <Trash />
                Delete
            </button>
            <div className="bg-base-200 dark:bg-base-800 p-2 rounded-md border border-base-300 dark:border-base-700 flex flex-col gap-2">
                <div
                    className={`${elt === rootElt || parentElt?.groupData.eltsPicked === "all" ? "hidden" : "flex"} items-center`}
                >
                    <div className="grow">Weight</div>
                    <input
                        className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                        defaultValue={elt.weight}
                        type="number"
                        min={0}
                        max={999}
                        step={1}
                        onChange={e => {
                            setElt(elt => {
                                const newElt = {...elt};
                                newElt.weight = +e.target.value;
                                return newElt;
                            });
                        }}
                    />
                </div>
                <div className="flex items-center">
                    <div className="grow">Type</div>
                    <Dropdown
                        options={{
                            group: "Group",
                            branch: "Branch"
                        }}
                        defaultOption={elt.type}
                        onChange={option => {
                            setElt(elt => {
                                const newElt = {...elt};
                                newElt.type = option;
                                return newElt;
                            });
                        }}
                    />
                </div>
                {elt.type === "group" ? (
                    <>
                        <div className="flex items-center">
                            <div className="grow">Elements Picked</div>
                            <Dropdown
                                options={{
                                    one: "One",
                                    all: "All",
                                    constant: "Constant",
                                    linear: "Linear Range",
                                    triangular: "Triangular Range"
                                }}
                                defaultOption={elt.groupData.eltsPicked}
                                onChange={option => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.groupData.eltsPicked = option;
                                        return newElt;
                                    });
                                }}
                            />
                            {/* <input type="number" defaultValue={(elt as Group).n} className="px-2 py-1 w-20 focus:bg-base-100 dark:focus:bg-base-900 focus:outline-none border-l border-base-300 dark:border-base-700" /> */}
                        </div>
                        <div
                            className={`flex items-center ${elt.groupData.eltsPicked === "constant" ? "" : "hidden"}`}
                        >
                            <div className="grow">Elements Constant</div>
                            <input
                                className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                                defaultValue={elt.groupData.eltsConst}
                                type="number"
                                min={0}
                                max={elt.groupData.eltPool.length}
                                step={1}
                                onChange={e => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.groupData.eltsConst =
                                            +e.target.value;
                                        return newElt;
                                    });
                                }}
                            />
                        </div>
                        <div
                            className={`flex items-center ${["linear", "triangular"].includes(elt.groupData.eltsPicked) ? "" : "hidden"}`}
                        >
                            <div className="grow">Elements Minimum</div>
                            <input
                                className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                                defaultValue={elt.groupData.eltsMin}
                                type="number"
                                min={0}
                                max={elt.groupData.eltPool.length}
                                step={1}
                                onChange={e => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.groupData.eltsMin =
                                            +e.target.value;
                                        return newElt;
                                    });
                                }}
                            />
                        </div>
                        <div
                            className={`flex items-center ${["linear", "triangular"].includes(elt.groupData.eltsPicked) ? "" : "hidden"}`}
                        >
                            <div className="grow">Elements Maximum</div>
                            <input
                                className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                                defaultValue={elt.groupData.eltsMax}
                                type="number"
                                min={0}
                                max={elt.groupData.eltPool.length}
                                step={1}
                                onChange={e => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.groupData.eltsMax =
                                            +e.target.value;
                                        return newElt;
                                    });
                                }}
                            />
                        </div>
                        <div className="flex flex-col mt-1">
                            <div>Element Pool</div>
                            <div
                                className={`bg-base-100 dark:bg-base-900 p-2 rounded-md border border-base-300 dark:border-base-700 ${elt.groupData.eltPool.length === 0 ? "hidden" : "flex"} flex-col gap-2 mt-1`}
                            >
                                {elt.groupData.eltPool.map((subElt, i) => (
                                    <ElementTreeSegment
                                        rootElt={rootElt}
                                        setRootElt={setRootElt}
                                        path={[...path, i]}
                                        key={subElt.id}
                                    />
                                ))}
                            </div>
                            <button
                                className={`bg-accent-500 dark:bg-accent-900 p-1 ${elt.groupData.eltPool.length === 0 ? "rounded-md" : "rounded-b-md"} cursor-pointer text-white flex justify-center gap-1 mx-2 self-start`}
                                onClick={() => {
                                    setElt(elt => {
                                        const newElt = {
                                            ...elt,
                                            groupData: {
                                                ...elt.groupData,
                                                eltPool: [
                                                    ...elt.groupData.eltPool
                                                ]
                                            }
                                        };
                                        newElt.groupData.eltPool.push(
                                            createTreeElement({type: "branch"})
                                        );
                                        return newElt;
                                    });
                                }}
                            >
                                <Plus />
                                Add
                            </button>
                        </div>
                    </>
                ) : elt.type === "branch" ? (
                    <>
                        <div className="flex items-center">
                            <div className="grow">Scale</div>
                            <input
                                className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                                defaultValue={elt.branchData.scale}
                                type="number"
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={e => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.branchData.scale =
                                            +e.target.value;
                                        return newElt;
                                    });
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="grow">Angle</div>
                            <input
                                className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                                defaultValue={elt.branchData.angle}
                                type="number"
                                min={-90}
                                max={90}
                                step={1}
                                onChange={e => {
                                    setElt(elt => {
                                        const newElt = {...elt};
                                        newElt.branchData.angle =
                                            +e.target.value;
                                        return newElt;
                                    });
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
