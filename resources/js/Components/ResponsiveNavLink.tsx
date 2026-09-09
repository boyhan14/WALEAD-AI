import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
                className={`flex w-full items-start rounded-xl px-4 py-3 ${
                active
                    ? 'bg-[#eaf8f1] text-[#123f32] focus:ring-2 focus:ring-[#c9f36d]'
                    : 'text-[#64736c] hover:bg-[#f1f7f4] hover:text-[#123f32] focus:ring-2 focus:ring-[#c9f36d]'
                } text-base font-semibold transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
