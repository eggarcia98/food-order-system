// components/DishSelector.tsx
import React, { useState, FC } from "react";

interface SelectItem {
    id: number;
    name: string;
    [key: string]: any; // For any additional properties
}

interface SelectorProps {
    onChangeParent?: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
    useCategories?: boolean;
    returnSelectedValue?: boolean;
    selectorList?: any[];
}

export const Selector: FC<SelectorProps> = ({
    onChangeParent,
    required = false,
    placeholder = "Put your placeholder here...",
    className = "",
    useCategories = false,
    returnSelectedValue = false,
    selectorList = [{ id: 1, name: "Sample option" }],
}) => {
    const [selectedValue, setSelectedValue] = useState({ id: 0, name: "" });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = selectorList.find(
            (item: SelectItem) => item.id === Number(e.target.value)
        );
        console.log(selected);

        if (selected) 
            setSelectedValue(selected);
        if (returnSelectedValue && onChangeParent)
            onChangeParent(selected.name);
    };

    return (
        <select
            required={required}
            value={selectedValue.id}
            onChange={handleChange}
            className={className}
        >
            <option value="">{placeholder}</option>

            {useCategories
                ? // Render with categories (optgroups)
                  selectorList.map((category) => (
                      <optgroup
                          key={category.category}
                          label={category.category}
                      >
                          {category.items.map((item: SelectItem) => (
                              <option key={item.id} value={item.name}>
                                  {item.name}
                              </option>
                          ))}
                      </optgroup>
                  ))
                : // Render simple list
                  selectorList.map(({ id, name, price}) => (
                      <option key={id} value={id}>
                          {name} {price ? `- $${price.toFixed(2)}` : ""}
                      </option>
                  ))}
        </select>
    );
};

// Export the dish lists for external use if needed
