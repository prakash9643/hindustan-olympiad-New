"use client";

import React, { useState } from "react";
import Select, { components } from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

type Props = {
  options: OptionType[];
  isDisabled: boolean;
  value: OptionType[];
  onChange: (selected: OptionType[]) => void;
};

export default function MultiSelectDistrict({
  options,
  isDisabled,
  value,
  onChange,
}: Props) {
  const [tempDistricts, setTempDistricts] = useState<OptionType[]>(value || []);

  const applyFilters = () => {
    onChange(tempDistricts); // ✅ clean and correct
  };
return (
  <div className="relative">
    <Select
      isMulti
      isDisabled={isDisabled}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      options={options}
			menuPlacement="auto" // or "bottom"
  		menuPosition="fixed"
      value={tempDistricts}
      onChange={(selected) => setTempDistricts(selected as OptionType[])}
			styles={{
				control: (base) => ({
					...base,
					minWidth: 220,           // or use 100% if you want it full-width
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}),
				menu: (base) => ({
					...base,
					width: 250,              // wider dropdown menu
				}),
				option: (base) => ({
					...base,
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}),
				multiValueLabel: (base) => ({
					...base,
					maxWidth: 120,
					overflow: "hidden",
					textOverflow: "ellipsis",
				}),
			}}
      components={{
        Option: (props) => (
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={() => null}
              className="mr-2"
            />
            <label>{props.label}</label>
          </components.Option>
        ),
        MenuList: (props) => (
          <>
            <components.MenuList {...props} />
            <div className="flex justify-center px-4 py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyFilters();
                }}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <span>Apply</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </>
        ),
      }}
      placeholder="Districts"
    />
  </div>
);

}
