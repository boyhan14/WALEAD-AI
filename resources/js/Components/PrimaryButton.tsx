import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex h-12 items-center justify-center rounded-xl border border-transparent bg-[#173b2d] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition duration-150 ease-in-out hover:bg-[#24543f] focus:bg-[#24543f] focus:outline-none focus:ring-2 focus:ring-[#d8e75f] focus:ring-offset-2 focus:ring-offset-[#f4f1eb] active:bg-[#102d22] dark:bg-[#d8e75f] dark:text-[#173b2d] dark:hover:bg-[#e4f274] dark:focus:ring-offset-[#101712] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
