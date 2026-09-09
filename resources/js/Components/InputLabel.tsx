import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-bold uppercase tracking-[0.11em] text-[#53635a] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
