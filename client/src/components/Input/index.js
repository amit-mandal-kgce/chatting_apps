import React from "react";

const Input = ({
  label = "",
  name = "",
  type = "text",
  className = "",
  isRequired = true,
  placeholder = "",
  value = '',
  onChange = () => {},
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 block w-full p-2.5 ${className}`}
     placeholder={placeholder} required={isRequired} value={value} onChange={onChange}/>
    </div>
  );
};

export default Input;
