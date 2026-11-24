import { Info } from "lucide-react";

export default function InfoTooltip({description}: {description: string}) {
    return <div className="relative group">
        <Info size={16} cursor="help" />
        <div className="absolute left-0 bg-black text-sm w-max max-w-40 p-1 text-center rounded-md hidden group-hover:block">{description}</div>
    </div>
}
