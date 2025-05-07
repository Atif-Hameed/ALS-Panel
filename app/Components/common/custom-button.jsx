"use client";
import { Loader2 } from "lucide-react";
import React from "react";



const Button = ({
    label = "Button",
    onClick,
    className = "",
    type = "button",
    loadingLabel = "Loading...",
    disabled = false,
    loading = false,
    icon,
    iconPosition = "right",
}) => {
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <div className="font-alice">
            <button
                className={`py-1 font-alice btn cursor-pointer rounded-lg px-3 text-sm  font-medium  min-w-fit justify-center  text-white  flex items-center hover:bg-yellow hover:text-white duration-300 transition-all ${disabled ? "bg-opacity-50 cursor-not-allowed" : ""
                    } ${className}`}
                onClick={handleClick}
                disabled={disabled || loading}
                type={type}
                aria-busy={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>{loadingLabel}</span>
                    </>
                ) : (
                    <>
                        {icon && iconPosition === "left" && icon}
                        {label}
                        {icon && iconPosition === "right" && icon}
                    </>
                )}
            </button>
        </div>
    );
};

export default Button;
