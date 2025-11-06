// components/DishSelector.tsx
import React, { useState, FC, use, useEffect } from "react";

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
    currentValue?: SelectItem;
}

export const Selector: FC<SelectorProps> = ({
    onChangeParent,
    required = false,
    placeholder = "Put your placeholder here...",
    className = "",
    useCategories = false,
    returnSelectedValue = false,
    selectorList = [{ id: 1, name: "Sample option" }],
    currentValue = { id: 0, name: "" },
}) => {
    const [selectedValue, setSelectedValue] = useState(currentValue);

    useEffect(() => {
        setSelectedValue(currentValue);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = selectorList.find(
            (item: SelectItem) => item.id === Number(e.target.value)
        );

        if (selected) setSelectedValue(selected);
        if (returnSelectedValue && onChangeParent) {
            onChangeParent(selected);
        }
    };

    return (
        <select
            required={required}
            value={selectedValue.id}
            onChange={handleChange}
            className={className}
            style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)' 
            }}
            onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(35, 160, 229, 0.2)';
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
            }}
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
                  selectorList.map(({ id, name, price }) => (
                      <option key={id} value={id}>
                          {name} {price ? `- $${price.toFixed(2)}` : ""}
                      </option>
                  ))}
        </select>
    );
};

// Export the dish lists for external use if needed
