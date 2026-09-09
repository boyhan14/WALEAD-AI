import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function PublicLayout({
    auth,
    children,
}: PropsWithChildren<{ auth: { user?: unknown } }>) {
    const [menuOpen, setMenuOpen] = useState(false);
    const ctaRoute = auth.user ? route('dashboard') : route('register');

    return (
        <div className="public-shell min-h-screen text-[#17221d] selection:bg-[#c9f36d] selection:text-[#173b2d]">
            <header className="public-header sticky top-0 z-50 border-b border-[#e6ece8]/90 bg-[#f7f9f7]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <a href="#top" className="flex items-center gap-3" aria-label="WALEAD AI home">
                        <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#173b2d] text-[#c9f36d] shadow-sm">
                            <ApplicationLogo className="h-6 w-6 fill-current" />
                        </span>
                        <span className="text-[17px] font-extrabold tracking-[-0.03em]">WALEAD<span className="text-[#08b77a]">.AI</span></span>
                    </a>
                    <nav className="hidden items-center gap-8 text-sm font-semibold text-[#64736c] md:flex" aria-label="Main navigation">
                        <a href="#product" className="transition hover:text-[#173b2d]">Produk</a>
                        <a href="#solutions" className="transition hover:text-[#173b2d]">Solusi</a>
                        <a href="#pricing" className="transition hover:text-[#173b2d]">Harga</a>
                        <a href="#faq" className="transition hover:text-[#173b2d]">Resource</a>
                    </nav>
                    <div className="hidden items-center gap-5 md:flex">
                        {!auth.user && <Link href={route('login')} className="text-sm font-bold text-[#53635a] transition hover:text-[#173b2d]">Masuk</Link>}
                        <Link href={ctaRoute} className="group inline-flex items-center gap-2 rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(23,59,45,0.14)] transition hover:-translate-y-0.5 hover:bg-[#24543f]">
                            {auth.user ? 'Ke Dashboard' : 'Mulai Gratis'} <span className="transition group-hover:translate-x-0.5">-&gt;</span>
                        </Link>
                    </div>
                    <button type="button" className="rounded-lg p-2 text-[#173b2d] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
                        <span className="block h-0.5 w-5 bg-current" />
                        <span className="mt-1.5 block h-0.5 w-5 bg-current" />
                        <span className="mt-1.5 block h-0.5 w-5 bg-current" />
                    </button>
                </div>
                {menuOpen && (
                    <nav className="border-t border-[#e6ece8] bg-white px-5 py-5 md:hidden" aria-label="Mobile navigation">
                        <div className="flex flex-col gap-4 text-sm font-bold text-[#53635a]">
                            <a href="#product" onClick={() => setMenuOpen(false)}>Produk</a>
                            <a href="#solutions" onClick={() => setMenuOpen(false)}>Solusi</a>
                            <a href="#pricing" onClick={() => setMenuOpen(false)}>Harga</a>
                            <a href="#faq" onClick={() => setMenuOpen(false)}>Resource</a>
                            <div className="flex items-center gap-4 border-t border-[#e6ece8] pt-4">
                                {!auth.user && <Link href={route('login')}>Masuk</Link>}
                                <Link href={ctaRoute} className="rounded-xl bg-[#173b2d] px-4 py-3 text-center text-white">{auth.user ? 'Ke Dashboard' : 'Mulai Gratis'}</Link>
                            </div>
                        </div>
                    </nav>
                )}
            </header>
            {children}
            <footer className="border-t border-[#e6ece8] bg-white">
                <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <a href="#top" className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#173b2d] text-[#c9f36d]"><ApplicationLogo className="h-5 w-5 fill-current" /></span>
                            <span className="font-extrabold tracking-[-0.03em]">WALEAD<span className="text-[#08b77a]">.AI</span></span>
                        </a>
                        <p className="mt-5 max-w-xs text-sm leading-6 text-[#64736c]">Turn WhatsApp conversations into revenue. Built for ambitious Indonesian businesses.</p>
                    </div>
                    <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8a9890]">Product</p><div className="flex flex-col gap-3 text-sm text-[#64736c]"><a href="#product">Features</a><a href="#pricing">Pricing</a><a href="#solutions">Integrations</a></div></div>
                    <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8a9890]">Resources</p><div className="flex flex-col gap-3 text-sm text-[#64736c]"><a href="#how-it-works">Cara Kerja</a><a href="#faq">FAQ</a><a href="#roi">Revenue Calculator</a></div></div>
                    <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8a9890]">Company</p><div className="flex flex-col gap-3 text-sm text-[#64736c]"><a href="#top">About WALEAD</a><a href="#top">Contact</a><a href="#top">Privacy</a></div></div>
                </div>
                <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-[#e6ece8] px-5 py-5 text-xs text-[#8a9890] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>&copy; {new Date().getFullYear()} WALEAD AI</span><span>Revenue intelligence for WhatsApp</span></div>
            </footer>
        </div>
    );
}
