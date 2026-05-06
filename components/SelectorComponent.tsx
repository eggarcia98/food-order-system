import React, { useEffect, useState } from "react";

interface SelectItem {
    id: number;
    name: string;
    price?: number;
}

interface SelectCategory<T extends SelectItem> {
    category: string;
    items: T[];
}

interface SelectorProps<T extends SelectItem> {
    onChangeParent?: (value: T | null) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
    useCategories?: boolean;
    returnSelectedValue?: boolean;
    selectorList?: T[] | SelectCategory<T>[];
    currentValue?: T | null;
}

const defaultSelectorList: SelectItem[] = [{ id: 1, name: "Sample option" }];

const isCategoryList = <T extends SelectItem>(
    value: T[] | SelectCategory<T>[],
): value is SelectCategory<T>[] => {
    return value.length > 0 && "items" in value[0];
};

const findSelectedItem = <T extends SelectItem>(
    selectorList: T[] | SelectCategory<T>[],
    id: number,
): T | null => {
    if (isCategoryList(selectorList)) {
        for (const category of selectorList) {
            const selected = category.items.find((item) => item.id === id);
            if (selected) {
                return selected;
            }
        }

        return null;
    }

    return selectorList.find((item) => item.id === id) ?? null;
};

export const Selector = <T extends SelectItem>({
    onChangeParent,
    required = false,
    placeholder = "Put your placeholder here...",
    className = "",
    useCategories = false,
    returnSelectedValue = false,
    selectorList,
    currentValue = null,
}: SelectorProps<T>) => {
    const options = (selectorList ?? defaultSelectorList) as T[] | SelectCategory<T>[];
    const [selectedValue, setSelectedValue] = useState<T | null>(currentValue);

    useEffect(() => {
        setSelectedValue(currentValue);
    }, [currentValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value === "" ? null : Number(e.target.value);
        const selected = selectedId === null ? null : findSelectedItem(options, selectedId);

        setSelectedValue(selected);
        if (returnSelectedValue && onChangeParent) {
            onChangeParent(selected);
        }
    };

    const renderOptions = () => {
        if (useCategories && isCategoryList(options)) {
            return options.map((category) => (
                <optgroup key={category.category} label={category.category}>
                    {category.items.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </optgroup>
            ));
        }

        return (options as T[]).map(({ id, name, price }) => (
            <option key={id} value={id}>
                {name} {price ? `- $${price.toFixed(2)}` : ""}
            </option>
        ));
    };

    return (
        <select
            required={required}
            value={selectedValue?.id ?? ""}
            onChange={handleChange}
            className={`${className} input-brand`}
        >
            <option value="">{placeholder}</option>

            {renderOptions()}
        </select>
    );
};

