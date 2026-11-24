import {useState} from "react";
import "./App.css";
import {type TreeElement, createTreeElement} from "./types/Elements";
import TreeVisual from "./components/TreeVisual";
import TreeEditor from "./components/TreeEditor";

export default function App() {
    const [numRecursions, setNumRecursions] = useState(5);
    const [rootElt, setRootElt] = useState<TreeElement>(
        createTreeElement({
            type: "group",
            groupData: {
                eltsPicked: "linear",
                eltsMin: 2,
                eltsMax: 3,
                eltPool: [
                    createTreeElement({
                        type: "branch",
                        branchData: {
                            scale: 0.68,
                            angle: -33
                        }
                    }),
                    createTreeElement({
                        type: "branch",
                        branchData: {
                            scale: 0.71,
                            angle: 5
                        }
                    }),
                    createTreeElement({
                        type: "branch",
                        branchData: {
                            scale: 0.64,
                            angle: 39
                        }
                    })
                ]
            }
        })
    );

    return (
        <div className="w-full h-full flex">
            <TreeEditor displayedRootElt={rootElt} setDisplayedRootElt={setRootElt} displayedNumRecursions={numRecursions} setDisplayedNumRecursions={setNumRecursions} />
            <TreeVisual rootElt={rootElt} numRecursions={numRecursions} />
        </div>
    );

    // return (
    //     <div className="w-full h-full grid place-items-center">
    //         <div className="grid grid-flow-col auto-cols-max items-stretch gap-8">
    //             <div className="flex flex-col gap-1">
    //                 <div className="text-sm text-center bg-base-100 dark:bg-base-900 py-1">
    //                     RECURSIVE SUB-ELEMENTS
    //                 </div>
    //                 {/* <table>
    //                     <thead>
    //                         <tr>
    //                             <th>Scale</th>
    //                             <th>Angle</th>
    //                             <th></th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {subBranches.map(({scale, angle}, i) => (
    //                             <tr key={i}>
    //                                 <td className="pr-1 py-1">
    //                                     <input
    //                                         className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 px-2 py-1 rounded-md hover:border-base-300 dark:hover:border-base-700 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
    //                                         defaultValue={scale}
    //                                         type="number"
    //                                         min={0}
    //                                         max={1}
    //                                         step={0.01}
    //                                         onChange={e => {
    //                                             setSubBranches(subBranches => {
    //                                                 const newSubBranches = [
    //                                                     ...subBranches
    //                                                 ];
    //                                                 newSubBranches[i].scale =
    //                                                     +e.target.value;
    //                                                 return newSubBranches;
    //                                             });
    //                                         }}
    //                                     />
    //                                 </td>
    //                                 <td className="p-1">
    //                                     <input
    //                                         className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 px-2 py-1 rounded-md hover:border-base-300 dark:hover:border-base-700 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
    //                                         defaultValue={angle}
    //                                         type="number"
    //                                         min={-90}
    //                                         max={90}
    //                                         step={1}
    //                                         onChange={e => {
    //                                             setSubBranches(subBranches => {
    //                                                 const newSubBranches = [
    //                                                     ...subBranches
    //                                                 ];
    //                                                 newSubBranches[i].angle =
    //                                                     +e.target.value;
    //                                                 return newSubBranches;
    //                                             });
    //                                         }}
    //                                     />
    //                                 </td>
    //                                 <td className="pl-1 py-1">
    //                                     <button
    //                                         className="text-white p-1 rounded-md cursor-pointer hover:text-red-500"
    //                                         onClick={() => {
    //                                             setSubBranches(subBranches => {
    //                                                 const newSubBranches = [
    //                                                     ...subBranches
    //                                                 ];
    //                                                 newSubBranches.splice(i, 1);
    //                                                 return newSubBranches;
    //                                             });
    //                                         }}
    //                                     >
    //                                         <Trash />
    //                                     </button>
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table> */}
    //                 {/* <button
    //                     className="bg-accent-500 dark:bg-accent-900 p-1 rounded-md cursor-pointer text-white flex justify-center gap-1"
    //                     onClick={() => {
    //                         setSubBranches(subBranches => [
    //                             ...subBranches,
    //                             {
    //                                 scale:
    //                                     (50 + Math.floor(Math.random() * 51)) /
    //                                     100,
    //                                 angle:
    //                                     (Math.floor(Math.random() * 7) - 3) * 10
    //                             }
    //                         ]);
    //                     }}
    //                 >
    //                     <Plus />
    //                     Add Branch
    //                 </button> */}
    //                 <div className="text-sm text-center bg-base-100 dark:bg-base-900 py-1 mt-8">
    //                     GENERATION OPTIONS
    //                 </div>
    //                 <div className="flex gap-2 items-center">
    //                     <p className="grow">Branch Depth</p>
    //                     <input
    //                         className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 px-2 py-1 rounded-md hover:border-base-300 dark:hover:border-base-700 focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none w-20"
    //                         defaultValue={numRecursions}
    //                         type="number"
    //                         min={1}
    //                         onChange={e => setNumRecursions(+e.target.value)}
    //                     />
    //                 </div>
    //                 {/* <button
    //                     className="bg-accent-500 dark:bg-accent-900 p-1 rounded-md cursor-pointer text-white flex justify-center gap-1 mt-8"
    //                     onClick={() =>
    //                         setPaths(generatePaths(subBranches, numRecursions))
    //                     }
    //                 >
    //                     Build Tree
    //                     <ArrowRight />
    //                 </button> */}
    //             </div>
    //             <div
    //                 style={{
    //                     aspectRatio: `${(maxPathX - minPathX) / (maxPathY - minPathY)}`
    //                 }}
    //             >

    //             </div>
    //         </div>
    //     </div>
    // );
}
