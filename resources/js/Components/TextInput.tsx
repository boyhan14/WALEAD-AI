import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'h-12 rounded-xl border-[#d8ded7] bg-white/70 px-4 text-sm text-[#17221c] shadow-none transition placeholder:text-[#9ba69e] focus:border-[#173b2d] focus:ring-2 focus:ring-[#d8e75f]/50 dark:border-[#344339] dark:bg-[#18221b] dark:text-[#f4f1eb] dark:focus:border-[#d8e75f] ' +
                className
            }
            ref={localRef}
        />
    );
});
