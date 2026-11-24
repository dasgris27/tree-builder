import {ChevronDown} from "lucide-react";
import {useEffect, useRef, useState} from "react";

interface DropdownProps<T extends Record<string, string>> {
    options: T;
    defaultOption: keyof T;
    onChange: (option: keyof T) => void;
}

export default function Dropdown<T extends Record<string, string>>({
    options,
    defaultOption,
    onChange
}: DropdownProps<T>) {
    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function closeDropdown(e: PointerEvent) {
            if (!dropdownRef.current?.contains(e.target as Node))
                setDropdownOpen(false);
        }

        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    return (
        <div
            className="relative"
            ref={dropdownRef}
        >
            <button
                className="px-2 py-1 flex gap-1 text-start cursor-pointer bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 hover:border-base-400 dark:hover:border-base-600 rounded-md ml-auto focus:border-accent-500 dark:focus:border-accent-800 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <span className="grow">{options[selectedOption]}</span>
                <ChevronDown />
            </button>
            <div
                className={`absolute right-0 top-full mt-1 flex flex-col bg-base-100 dark:bg-base-900 rounded-md overflow-hidden border border-base-300 dark:border-base-700 z-10 w-max ${dropdownOpen ? "" : "hidden"}`}
            >
                {(Object.entries(options) as [keyof T, string][]).map(([id, name], i) => (
                    <button
                        key={i}
                        className={`px-2 py-1 flex gap-1 w-full text-start cursor-pointer ${id === selectedOption ? "bg-accent-500 dark:bg-accent-900" : "hover:bg-base-300 dark:hover:bg-base-700"}`}
                        onClick={() => {
                            setDropdownOpen(false);
                            setSelectedOption(id as keyof T);
                            onChange(id as keyof T);
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
        // <select className="appearance-none min-w-30 focus:outline-none px-2 py-1 bg-base-200 dark:bg-base-800 border-l border-base-300 dark:border-base-700">
        //     {Object.entries(options).map(([id, displayName]) => <option value="id">{displayName}</option>)}
        // </select>
    );
}
