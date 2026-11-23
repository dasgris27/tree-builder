import type { Dispatch, SetStateAction } from "react";
import type { TreeElement } from "../types/Elements";
import ElementTreeSegment from "./ElementTreeSegment";

export default function ElementTree({elt, setElt}: {elt: TreeElement, setElt: Dispatch<SetStateAction<TreeElement>>}) {
    return <ElementTreeSegment rootElt={elt} setRootElt={setElt} path={[]} />
}
