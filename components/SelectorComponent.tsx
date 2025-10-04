// components/DishSelector.tsx
import React from "react";

export interface DishOption {
    value: string;
    label: string;
}

export interface DishCategory {
    category: string;
    items: DishOption[];
}

interface SelectorProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
    useCategories?: boolean;
    selectorList?: any[];
}

export const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    required = false,
    placeholder = "Put your placeholder here...",
    className = "",
    useCategories = false,
    selectorList = [{ id: 1, name: "Sample option" }],
}) => {
    return (
        <select
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition center"
        >
            <option value="">{placeholder}</option>

            {useCategories
                ? // Render with categories (optgroups)
                  selectorList.map((category) => (
                      <optgroup
                          key={category.category}
                          label={category.category}
                      >
                          {category.items.map((item: any) => (
                              <option key={item.value} value={item.label}>
                                  {item.label}
                              </option>
                          ))}
                      </optgroup>
                  ))
                : // Render simple list
                  selectorList.map(({ id, name }) => (
                      <option key={id} value={name}>
                          {name}
                      </option>
                  ))}
        </select>
    );
};

// Export the dish lists for external use if needed
