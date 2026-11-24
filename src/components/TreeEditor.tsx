import {useState, type Dispatch, type SetStateAction} from "react";
import type {TreeElement} from "../types/Elements";
import ElementTree from "./ElementTree";
import {ArrowRight} from "lucide-react";
import InfoTooltip from "./InfoTooltip";

export default function TreeEditor({
    displayedRootElt,
    setDisplayedRootElt,
    displayedNumRecursions,
    setDisplayedNumRecursions
}: {
    displayedRootElt: TreeElement;
    setDisplayedRootElt: Dispatch<SetStateAction<TreeElement>>;
    displayedNumRecursions: number;
    setDisplayedNumRecursions: Dispatch<SetStateAction<number>>;
}) {
    const [rootElt, setRootElt] = useState(displayedRootElt);
    const [numRecursions, setNumRecursions] = useState(displayedNumRecursions);
    return (
        <div className="w-1/2 bg-base-100 dark:bg-base-900 py-2 flex flex-col gap-2 border-r border-base-200 dark:border-base-800 overflow-auto max-h-full">
            <div className="text-sm text-center bg-base-200 dark:bg-base-800 py-1">
                RECURSIVE SUB-ELEMENTS
            </div>
            <div className="flex flex-col gap-2 px-2">
                <ElementTree elt={rootElt} setElt={setRootElt} />
            </div>
            <div className="text-sm text-center bg-base-200 dark:bg-base-800 py-1 mt-4">
                GENERATION OPTIONS
            </div>
            <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-4">
                    <div className="grow flex gap-2 items-center">
                        Recursions
                        <InfoTooltip description="How deep the tree goes. Must be a positive integer" />
                    </div>
                    <input
                        className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 px-2 py-1 rounded-md hover:border-base-400 dark:hover:border-base-600 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                        defaultValue={numRecursions}
                        type="number"
                        min={1}
                        step={1}
                        onChange={e => {
                            setNumRecursions(+e.target.value);
                        }}
                    />
                </div>
                <button
                    className="bg-accent-500 dark:bg-accent-900 p-1 rounded-md cursor-pointer text-white flex justify-center gap-1 mt-8"
                    onClick={() => {
                        setDisplayedRootElt(() => structuredClone(rootElt));
                        setDisplayedNumRecursions(numRecursions);
                    }}
                >
                    Build Tree
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}
