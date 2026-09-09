import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold leading-5 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#c9f36d] ' +
                (active
                    ? 'bg-[#eaf8f1] text-[#123f32]'
                    : 'text-[#718078] hover:bg-[#f1f7f4] hover:text-[#123f32]') +
                className
            }
        >
            {children}
        </Link>
    );
}
