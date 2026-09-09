import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-xl border border-[#dce6df] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#53635a] shadow-sm transition duration-150 ease-in-out hover:-translate-y-0.5 hover:bg-[#f1f7f4] focus:outline-none focus:ring-2 focus:ring-[#c9f36d] disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
