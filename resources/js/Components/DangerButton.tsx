import { ButtonHTMLAttributes } from 'react';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl border border-transparent bg-[#b4544d] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition duration-150 ease-in-out hover:-translate-y-0.5 hover:bg-[#9d433d] focus:outline-none focus:ring-2 focus:ring-[#f2b7ae] active:bg-[#863a35] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
