import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="guest-shell min-h-screen bg-[#f4f1eb] text-[#17221c]">
            <div className="grid min-h-screen lg:grid-cols-[minmax(360px,0.88fr)_minmax(520px,1.12fr)]">
                <aside className="relative hidden overflow-hidden bg-[#173b2d] px-12 py-10 text-[#f7f3ea] lg:flex lg:flex-col lg:justify-between xl:px-16">
                    <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border-[34px] border-[#d8e75f]/20" />
                    <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full border-[52px] border-[#d8e75f]/10" />
                    <Link href="/" className="relative flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8e75f] text-[#173b2d] shadow-lg shadow-black/10">
                            <ApplicationLogo className="h-7 w-7 fill-current" />
                        </span>
                        <span className="text-lg font-bold tracking-tight">WALEAD</span>
                    </Link>

                    <div className="relative max-w-md">
                        <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-[#d8e75f]">Revenue, recovered</p>
                        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] xl:text-6xl">
                            Every chat can become a customer.
                        </h1>
                        <p className="mt-7 max-w-sm text-base leading-7 text-[#d9e2d7]">
                            One calm workspace for conversations, leads, and the next best action.
                        </p>
                        <div className="mt-12 flex items-center gap-3 text-sm text-[#d9e2d7]">
                            <span className="h-2 w-2 rounded-full bg-[#d8e75f]" />
                            Built for growing Indonesian businesses
                        </div>
                    </div>

                    <p className="relative text-xs text-[#a9c0af]">WALEAD AI / 2026</p>
                </aside>

                <main className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
                    <div className="flex items-center justify-between lg:justify-end">
                        <Link href="/" className="flex items-center gap-2 lg:hidden">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173b2d] text-[#d8e75f]">
                                <ApplicationLogo className="h-6 w-6 fill-current" />
                            </span>
                            <span className="font-bold tracking-tight text-[#173b2d]">WALEAD</span>
                        </Link>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#809087]">Workspace access</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center py-12 lg:py-8">
                        <div className="w-full max-w-md">{children}</div>
                    </div>

                    <p className="text-center text-xs text-[#809087] lg:text-right">Secure sign-in for your sales workspace</p>
                </main>
            </div>
        </div>
    );
}
