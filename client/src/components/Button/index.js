import React from 'react'

const Button = ({
    label = 'button',
    type = 'button',
    className = '',
    disabled = false,
}) => {
  return (
    <button type={type} className={`px-5 py-2.5 text-white bg-blue-500 rounded-lg text-sm ${className}`} disabled = {disabled}>{label}</button>
  )
}

export default Button
