import type {TreeElement} from "../types/Elements";

function pickSubBranches(
    elt: TreeElement,
    path: number[]
): {scale: number; angle: number}[] | string {
    if (elt.type === "branch") {
        return [{...elt.branchData}];
    } else if (elt.type === "group") {
        const branches = [];
        if (elt.groupData.eltsPicked === "all") {
            for (let i = 0; i < elt.groupData.eltPool.length; i++) {
                const subEltBranches = pickSubBranches(
                    elt.groupData.eltPool[i],
                    [...path, i]
                );
                if (typeof subEltBranches === "string") return subEltBranches;
                branches.push(...subEltBranches);
            }
        } else {
            let numEltsPicked = 0;
            if (elt.groupData.eltsPicked === "one") {
                if (elt.groupData.eltPool.length === 0)
                    return `${path.length === 0 ? "Root Element" : `Element ${path.map(index => index + 1).join(".")}`} - cannot pick one element; zero elements in pool`;
                numEltsPicked = 1;
            } else if (elt.groupData.eltsPicked === "constant") {
                if (
                    elt.groupData.eltsConst < 0 ||
                    elt.groupData.eltsConst > elt.groupData.eltPool.length
                ) {
                    return `${path.length === 0 ? "Root Element" : `Element ${path.map(index => index + 1).join(".")}`} - elements constant out of bounds`;
                }
                numEltsPicked = elt.groupData.eltsConst;
            } else if (
                elt.groupData.eltsPicked === "linear" ||
                elt.groupData.eltsPicked === "triangular"
            ) {
                if (
                    elt.groupData.eltsMin < 0 ||
                    elt.groupData.eltsMin > elt.groupData.eltPool.length
                ) {
                    return `${path.length === 0 ? "Root Element" : `Element ${path.map(index => index + 1).join(".")}`} - elements minimum out of bounds`;
                }
                if (
                    elt.groupData.eltsMax < 0 ||
                    elt.groupData.eltsMax > elt.groupData.eltPool.length
                ) {
                    return `${path.length === 0 ? "Root Element" : `Element ${path.map(index => index + 1).join(".")}`} - elements maximum out of bounds`;
                }
                numEltsPicked =
                    Math.floor(
                        Math.random() *
                            (elt.groupData.eltsMax - elt.groupData.eltsMin + 1)
                    ) + elt.groupData.eltsMin;
                if (elt.groupData.eltsPicked === "triangular") {
                    numEltsPicked +=
                        Math.floor(
                            Math.random() *
                                (elt.groupData.eltsMax -
                                    elt.groupData.eltsMin +
                                    1)
                        ) + elt.groupData.eltsMin;
                    numEltsPicked += Math.floor(Math.random() * 2);
                    numEltsPicked = Math.floor(numEltsPicked / 2);
                }
            }
            const subEltIndexes = Array.from(
                {length: elt.groupData.eltPool.length},
                (_, i) => i
            );
            while (numEltsPicked > 0) {
                const cumulativeWeights: number[] = new Array(
                    subEltIndexes.length
                ).fill(0);
                for (let i = 0; i < cumulativeWeights.length; i++) {
                    const weight =
                        elt.groupData.eltPool[subEltIndexes[i]].weight;
                    if (weight < 1 || Math.floor(weight) !== weight)
                        `${
                            path.length === 0
                                ? "Root Element"
                                : `Element ${path
                                      .map(index => index + 1)
                                      .concat([subEltIndexes[i]])
                                      .join(".")}`
                        } - invalid weight value`;
                    for (let j = i; j < cumulativeWeights.length; j++)
                        cumulativeWeights[j] += weight;
                }
                const num = Math.floor(
                    Math.random() *
                        cumulativeWeights[cumulativeWeights.length - 1]
                );
                let weightIndexToPick = 0;
                while (num >= cumulativeWeights[weightIndexToPick])
                    weightIndexToPick++;
                const indexToPick = subEltIndexes.splice(
                    weightIndexToPick,
                    1
                )[0];
                const subEltBranches = pickSubBranches(
                    elt.groupData.eltPool[indexToPick],
                    [...path, indexToPick]
                );
                if (typeof subEltBranches === "string") return subEltBranches;
                branches.push(...subEltBranches);
                numEltsPicked--;
            }
        }
        return branches;
    } else {
        return `${path.length === 0 ? "Root Element" : `Element ${path.map(index => index + 1).join(".")}`} - invalid type`;
    }
}

function generatePaths(
    rootElt: TreeElement,
    numRecursions: number,
    startPos = [0, 0],
    startAngle = 90,
    startScale = 1
): {startPos: number[], endPos: number[], scale: number, recursionLevel: number}[] {
    if (numRecursions === 0) return [];
    const paths = [];
    const endPos = [
        startPos[0] + startScale * Math.cos((startAngle * Math.PI) / 180),
        startPos[1] - startScale * Math.sin((startAngle * Math.PI) / 180)
    ];
    paths.push({
        startPos,
        endPos,
        scale: startScale,
        recursionLevel: numRecursions
    });
    const subBranches = pickSubBranches(rootElt, []);
    if (typeof subBranches === "string") {
        return [];
    }
    for (const subBranch of subBranches) {
        paths.push(
            ...generatePaths(
                rootElt,
                numRecursions - 1,
                endPos,
                startAngle - subBranch.angle,
                startScale * subBranch.scale
            )
        );
    }
    return paths;
}

export default function TreeVisual({
    rootElt,
    numRecursions
}: {
    rootElt: TreeElement;
    numRecursions: number;
}) {
    const subBranches = pickSubBranches(rootElt, []);
    if (typeof subBranches === "string") {
        return <div className="w-1/2 h-full grid place-items-center">{subBranches}</div>
    } else {
        const paths = generatePaths(rootElt, numRecursions);
        const minPathX = Math.min(
            ...paths.map(({startPos, endPos}) => Math.min(startPos[0], endPos[0]))
        );
        const maxPathX = Math.max(
            ...paths.map(({startPos, endPos}) => Math.max(startPos[0], endPos[0]))
        );
        const minPathY = Math.min(
            ...paths.map(({startPos, endPos}) => Math.min(startPos[1], endPos[1]))
        );
        const maxPathY = Math.max(
            ...paths.map(({startPos, endPos}) => Math.max(startPos[1], endPos[1]))
        );
        return (
            <div className="w-1/2 h-full grid justify-items-center items-end bg-gray-200 dark:bg-mist-950 relative">
                <div className="w-1/2 aspect-square absolute bg-yellow-300 dark:bg-gray-300 top-0 right-0 -translate-y-3/4 rounded-full"></div>
                <svg
                    className="max-w-full max-h-full z-10"
                    viewBox={`${minPathX} ${minPathY} ${maxPathX - minPathX} ${maxPathY - minPathY}`}
                >
                    {paths.map(({startPos, endPos, scale, recursionLevel}, i) => (
                        <>
                            <line
                                key={2 * i}
                                x1={startPos[0]}
                                y1={startPos[1]}
                                x2={endPos[0]}
                                y2={endPos[1]}
                                className="stroke-yellow-950 dark:stroke-yellow-100"
                                // className="stroke-[#C2A887]"
                                strokeWidth={0.1 * scale}
                                strokeLinecap="round"
                                // vectorEffect="non-scaling-stroke"
                            />
                            <line
                                key={2 * i + 1}
                                x1={startPos[0]}
                                y1={startPos[1]}
                                x2={endPos[0]}
                                y2={endPos[1]}
                                className="stroke-green-500 dark:stroke-emerald-800"
                                // className={"stroke-[#7A9A4E]"}
                                opacity={Math.pow(
                                    1 -
                                        (recursionLevel - 1) /
                                            (numRecursions - 1),
                                    2
                                )}
                                strokeWidth={0.1 * scale}
                                strokeLinecap="round"
                                // vectorEffect="non-scaling-stroke"
                            />
                        </>
                    ))}
                </svg>
            </div>
        );
    }
}
