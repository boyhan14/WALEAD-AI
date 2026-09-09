import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="app-shell min-h-screen">
            <nav className="app-header sticky top-0 z-40 border-b border-[#e3eae6] bg-white/90 backdrop-blur-xl">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
                    <div className="flex min-h-[76px] items-center justify-between gap-6">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#123f32] text-[#c9f36d] shadow-sm">
                                        <ApplicationLogo className="block h-6 w-6 fill-current" />
                                    </span>
                                    <span className="hidden text-[17px] font-extrabold tracking-[-0.03em] text-[#17221d] sm:inline">WALEAD<span className="text-[#08b77a]">.AI</span></span>
                                </Link>
                            </div>

                            <div className="hidden items-center gap-1 sm:ms-8 md:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href="/inbox"
                                    active={window.location.pathname.startsWith('/inbox')}
                                >
                                    Inbox
                                </NavLink>
                                <NavLink
                                    href="/customers"
                                    active={window.location.pathname.startsWith('/customers')}
                                >
                                    Customers
                                </NavLink>
                                <NavLink
                                    href="/products"
                                    active={window.location.pathname.startsWith('/products')}
                                >
                                    Products
                                </NavLink>
                                <NavLink
                                    href="/orders"
                                    active={window.location.pathname.startsWith('/orders')}
                                >
                                    Orders
                                </NavLink>
                                <NavLink
                                    href="/approvals"
                                    active={window.location.pathname.startsWith('/approvals')}
                                >
                                    AI Approvals
                                </NavLink>
                                <NavLink
                                    href="/simulator"
                                    active={window.location.pathname.startsWith('/simulator')}
                                >
                                    Simulator
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden items-center sm:flex">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-xl">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-semibold leading-4 text-[#53635a] transition hover:bg-[#f1f7f4] hover:text-[#123f32] focus:outline-none focus:ring-2 focus:ring-[#c9f36d]"
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf8f1] text-xs font-extrabold text-[#08a970]">{user.name.slice(0, 1).toUpperCase()}</span>
                                                <span className="hidden lg:inline">{user.name}</span>

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('settings.whatsapp')}
                                        >
                                            WhatsApp Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('settings.system-health')}
                                        >
                                            System Health
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-[#53635a] transition hover:bg-[#f1f7f4] hover:text-[#123f32] focus:outline-none focus:ring-2 focus:ring-[#c9f36d]"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/inbox"
                            active={window.location.pathname.startsWith('/inbox')}
                        >
                            Inbox
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/customers"
                            active={window.location.pathname.startsWith('/customers')}
                        >
                            Customers
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/products"
                            active={window.location.pathname.startsWith('/products')}
                        >
                            Products
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/orders"
                            active={window.location.pathname.startsWith('/orders')}
                        >
                            Orders
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/approvals"
                            active={window.location.pathname.startsWith('/approvals')}
                        >
                            AI Approvals
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/simulator"
                            active={window.location.pathname.startsWith('/simulator')}
                        >
                            Simulator
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-[#e3eae6] pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-bold text-[#17221d]">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('settings.whatsapp')}>
                                WhatsApp Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('settings.system-health')}>
                                System Health
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-[#e3eae6] bg-white/70">
                    <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
