import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const plans = [
    { 
        name: 'Starter', 
        description: 'Untuk mulai merapikan penjualan dari chat.', 
        price: 'Rp 0', 
        period: 'selamanya', 
        features: ['100 percakapan aktif', 'Lead scoring', 'Customer directory', 'Catalog & simulator'], 
        action: 'Mulai Gratis' 
    },
    { 
        name: 'Growth', 
        description: 'Untuk bisnis yang serius menjadikan chat sebagai sales engine.', 
        price: 'Rp 299.000', 
        period: '/ bulan', 
        features: ['Unlimited conversations', 'AI Revenue Recovery', 'Human-in-the-loop', 'WhatsApp Cloud API', 'Multi-agent workspace'], 
        action: 'Mulai 14 Hari Gratis', 
        featured: true 
    },
    { 
        name: 'Agency / Enterprise', 
        description: 'Untuk multi-brand dan volume percakapan tinggi.', 
        price: 'Rp 899.000', 
        period: '/ bulan', 
        features: ['Multi-workspace', 'Dedicated AI provider', 'Advanced analytics', 'Priority support'], 
        action: 'Hubungi Sales' 
    },
];

const faqs = [
    'Apa itu WALEAD AI?', 
    'Apakah membutuhkan WhatsApp Business?', 
    'Apakah WALEAD membaca semua chat?', 
    'Apakah AI bisa mengirim pesan otomatis?', 
    'Apakah saya bisa menyetujui pesan AI sebelum dikirim?', 
    'Apakah data workspace terpisah?', 
    'Apakah tersedia WhatsApp Cloud API?', 
    'Apakah ada paket gratis?'
];

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
    return (
        <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#08a970]">{eyebrow}</p>
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#17221d] sm:text-5xl">{title}</h2>
            {children && <p className="mt-5 text-base leading-7 text-[#64736c]">{children}</p>}
        </div>
    );
}

function ConversationVisual() {
    return (
        <div className="surface-gloss relative mx-auto max-w-[520px] rounded-[28px] border border-[#dce9df] bg-white p-5 shadow-[0_30px_80px_rgba(25,65,45,0.13)] sm:p-7 lg:min-h-[425px]">
            <div className="flex items-center justify-between border-b border-[#edf1ed] pb-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f8ee] text-sm font-bold text-[#079863]">AS</span>
                    <div>
                        <p className="text-sm font-bold">Andi Saputra</p>
                        <p className="text-xs text-[#8a9890]">Active conversation</p>
                    </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-[#08b77a]" />
            </div>

            <div className="space-y-4 py-6 text-sm">
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-[#f1f5f1] px-4 py-3 leading-6 text-[#53635a]">
                    Kak, yang ukuran M masih ada? Bisa dikirim hari ini?
                </div>
                <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-[#173b2d] px-4 py-3 leading-6 text-white shimmer-dark">
                    Hai Kak Andi, ukuran M masih tersedia dan bisa dikirim hari ini.
                </div>
            </div>

            {/* AI Insight Box with Shimmer */}
            <div className="relative mt-5 w-full rounded-2xl border border-[#d8eddf] bg-[#f8fffa] p-4 shadow-[0_15px_40px_rgba(25,65,45,0.14)] shimmer-light">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#799187]">AI insight</span>
                    <span className="text-lg font-bold text-[#173b2d]">87</span>
                </div>
                <p className="mt-2 text-xs font-bold text-[#173b2d]">High purchase probability</p>
                <div className="mt-3 h-1.5 rounded-full bg-[#dcebe0]">
                    <div className="h-1.5 w-[87%] rounded-full bg-[#08b77a]" />
                </div>
                <p className="mt-3 text-[11px] leading-4 text-[#718078]">Intent: product inquiry</p>
            </div>

            {/* Revenue Recovered Box with Shimmer */}
            <div className="relative mt-5 w-fit rounded-2xl bg-[#c9f36d] px-5 py-4 text-[#173b2d] shadow-[0_14px_30px_rgba(112,155,42,0.2)] shimmer-btn">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]">Revenue recovered</p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Rp 2.450.000</p>
            </div>
        </div>
    );
}

export default function Welcome({ auth }: PageProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <PublicLayout auth={auth}>
            <Head title="WALEAD AI - Turn WhatsApp Conversations Into Revenue" />
            <main id="top">
                {/* Hero Section */}
                <section className="relative overflow-hidden border-b border-[#e6ece8] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:pb-32">
                    <div className="absolute -right-24 top-20 -z-0 h-96 w-96 rounded-full bg-[#dff6e9] blur-3xl opacity-70" />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                        <div className="relative z-10">
                            <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08a970]">
                                <span className="h-2 w-2 rounded-full bg-[#08b77a] animate-pulse" /> 
                                AI revenue operating system for WhatsApp
                            </p>
                            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-[#17221d] sm:text-6xl lg:text-[70px]">
                                Turn WhatsApp conversations <span className="text-[#08a970]">into revenue.</span>
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 text-[#64736c]">
                                WALEAD AI membaca percakapan pelanggan, menemukan peluang yang terlewat, dan membantu tim Anda mengubah chat menjadi penjualan.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link 
                                    href={route('register')} 
                                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#173b2d] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_25px_rgba(23,59,45,0.16)] transition hover:-translate-y-0.5 hover:bg-[#24543f] shimmer-btn"
                                >
                                    Mulai Gratis <span className="transition group-hover:translate-x-1">-&gt;</span>
                                </Link>
                                <a 
                                    href="#how-it-works" 
                                    className="inline-flex items-center justify-center rounded-xl border border-[#dce5df] bg-white px-6 py-4 text-sm font-bold text-[#53635a] transition hover:border-[#9fc4aa] hover:text-[#173b2d]"
                                >
                                    Lihat Cara Kerja
                                </a>
                            </div>
                            <p className="mt-5 text-xs text-[#8a9890]">
                                Tidak perlu kartu kredit <span className="mx-2 text-[#c4d0c7]">·</span> Setup dalam hitungan menit
                            </p>
                        </div>
                        <ConversationVisual />
                    </div>
                </section>

                {/* Social Proof */}
                <section id="solutions" className="border-b border-[#e6ece8] bg-white px-5 py-8 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
                        <p className="max-w-sm text-sm font-semibold leading-6 text-[#64736c]">
                            Dipercaya bisnis yang ingin menjadikan WhatsApp sebagai channel penjualan yang lebih terukur.
                        </p>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.13em] text-[#8a9890]">
                            <span>AI-powered</span>
                            <span>Real-time</span>
                            <span>Multi-workspace</span>
                            <span>WhatsApp Cloud API</span>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading 
                            eyebrow="The revenue loop" 
                            title="Dari chat. Menjadi peluang. Menjadi revenue." 
                            children="Satu alur yang membantu tim Anda tahu apa yang perlu dilakukan, kapan harus dilakukan, dan mengapa itu penting." 
                        />
                        <div className="mt-16 grid gap-0 border-y border-[#dfe9e1] md:grid-cols-4">
                            {[
                                ['01', 'Connect WhatsApp', 'Hubungkan WhatsApp Business Anda ke satu workspace.'], 
                                ['02', 'AI reads every conversation', 'Pahami intent, urgency, dan potensi pembelian.'], 
                                ['03', 'Take the right action', 'Dapatkan saran respons, follow-up, atau eskalasi.'], 
                                ['04', 'Recover more revenue', 'Peluang yang terlewat kembali menjadi penjualan.']
                            ].map(([number, title, text], index) => (
                                <div key={number} className={`py-8 md:px-7 ${index > 0 ? 'border-t border-[#dfe9e1] md:border-l md:border-t-0' : ''}`}>
                                    <span className="text-xs font-bold tracking-[0.16em] text-[#08a970]">{number}</span>
                                    <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-[#718078]">{text}</p>
                                    {index < 3 && <span className="mt-8 block text-2xl text-[#b4c4b8]">-&gt;</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Section */}
                <section id="product" className="bg-[#eef8f1] px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading 
                            eyebrow="Built for the moment that matters" 
                            title="Bukan sekadar inbox. Sebuah revenue intelligence layer." 
                            children="WALEAD membantu Anda melihat sinyal di balik setiap pesan, lalu mengubahnya menjadi tindakan yang bisa diukur." 
                        />
                        <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                            {/* Feature Hero Card with Shimmer */}
                            <div className="rounded-[24px] bg-[#173b2d] p-7 text-white sm:p-10 shimmer-dark">
                                <div className="flex items-start justify-between gap-5">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9f36d]">01 / AI Revenue Recovery</p>
                                        <h3 className="mt-5 max-w-lg text-3xl font-semibold tracking-[-0.04em]">
                                            Temukan chat yang hampir closing, tapi belum selesai.
                                        </h3>
                                    </div>
                                    <span className="text-3xl text-[#c9f36d]">↗</span>
                                </div>
                                <div className="mt-12 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-white/10 p-4">
                                        <p className="text-xs text-[#b9cec0]">Hot leads today</p>
                                        <p className="mt-3 text-2xl font-semibold">28</p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-4">
                                        <p className="text-xs text-[#b9cec0]">Follow-ups ready</p>
                                        <p className="mt-3 text-2xl font-semibold">14</p>
                                    </div>
                                    <div className="rounded-xl bg-[#c9f36d] p-4 text-[#173b2d] shimmer-btn">
                                        <p className="text-xs font-bold">Recovered value</p>
                                        <p className="mt-3 text-2xl font-semibold">+24%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="rounded-[24px] border border-[#d7e8db] bg-white p-7 shadow-xs">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08a970]">02 / Lead intelligence</p>
                                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">Tahu siapa yang siap membeli.</h3>
                                    <p className="mt-3 text-sm leading-6 text-[#718078]">Intent dan score yang mudah dipahami, bukan angka tanpa konteks.</p>
                                </div>
                                <div className="rounded-[24px] border border-[#d7e8db] bg-white p-7 shadow-xs">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08a970]">03 / Human approval</p>
                                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">AI cepat, Anda tetap memegang kendali.</h3>
                                    <p className="mt-3 text-sm leading-6 text-[#718078]">Persetujuan manusia untuk respons berisiko tinggi sebelum dikirim.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workspace Preview */}
                <section className="px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <SectionHeading 
                                eyebrow="One workspace" 
                                title="Semua percakapan. Satu workspace." 
                                children="Dari pesan pertama sampai pembelian, tim Anda bekerja dengan konteks yang sama." 
                            />
                            <span className="hidden pb-2 text-sm font-bold text-[#08a970] md:block">Product preview / 01</span>
                        </div>

                        <div className="mt-14 overflow-hidden rounded-[26px] border border-[#dfe9e1] bg-white shadow-[0_24px_70px_rgba(25,65,45,0.1)]">
                            <div className="flex items-center justify-between border-b border-[#edf1ed] px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#f0a99b]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#f2d37a]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#9cd3a9]" />
                                </div>
                                <span className="text-xs font-bold tracking-[0.12em] text-[#8a9890]">WALEAD / INBOX</span>
                            </div>

                            <div className="grid min-h-[330px] md:grid-cols-[0.7fr_1.2fr_0.8fr]">
                                <div className="border-b border-[#edf1ed] p-5 md:border-r md:border-b-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a9890]">Conversations</p>
                                    {['Andi Saputra', 'Sinta Rahma', 'Budi Santoso'].map((name, index) => (
                                        <div key={name} className={`mt-5 flex items-center gap-3 rounded-xl p-2 ${index === 0 ? 'bg-[#eef8f1]' : ''}`}>
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dceee2] text-[10px] font-bold text-[#47735a]">
                                                {name.split(' ').map((word) => word[0]).join('')}
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold">{name}</p>
                                                <p className="mt-1 text-[10px] text-[#8a9890]">
                                                    {index === 0 ? 'Kak, ready hari ini?' : 'Last message 2h ago'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-b border-[#edf1ed] p-6 md:border-r md:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold">Andi Saputra</p>
                                        <span className="text-xs text-[#08a970]">● Active</span>
                                    </div>
                                    <div className="mt-12 space-y-3 text-xs">
                                        <p className="w-fit rounded-xl rounded-tl-sm bg-[#f1f5f1] px-4 py-3 text-[#64736c]">
                                            Kak ready untuk dikirim hari ini?
                                        </p>
                                        <p className="ml-auto w-fit rounded-xl rounded-tr-sm bg-[#173b2d] px-4 py-3 text-white shimmer-dark">
                                            Ready Kak, mau ukuran M atau L?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#fbfdfb] p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a9890]">AI Insight</p>
                                    <div className="mt-7 rounded-xl border border-[#d8eddf] bg-white p-4 shimmer-light">
                                        <p className="text-xs font-bold text-[#08a970]">HOT LEAD</p>
                                        <p className="mt-2 text-3xl font-semibold">92</p>
                                        <p className="mt-1 text-[11px] text-[#718078]">Intent: Purchase</p>
                                    </div>
                                    <button type="button" className="mt-4 w-full rounded-xl bg-[#c9f36d] px-3 py-3 text-xs font-bold text-[#173b2d] shimmer-btn">
                                        Approve &amp; Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="border-y border-[#e6ece8] bg-[#fbfcfb] px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading 
                            eyebrow="Pricing that grows with you" 
                            title="Pilih cara Anda bertumbuh." 
                            children="Mulai dari yang sederhana. Naikkan kapasitas saat percakapan dan revenue Anda berkembang." 
                        />
                        <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <div 
                                    key={plan.name} 
                                    className={`relative rounded-[24px] p-7 transition ${
                                        plan.featured 
                                            ? 'border-2 border-[#08b77a] bg-[#eaf8f2] shadow-[0_25px_60px_rgba(8,183,122,0.14)] lg:-mt-5 lg:p-9 shimmer-light' 
                                            : 'border border-[#dfe9e1] bg-white hover:border-[#9fc4aa]'
                                    }`}
                                >
                                    {plan.featured && (
                                        <span className="absolute -top-3 right-6 rounded-full bg-[#08b77a] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                                            Most Popular
                                        </span>
                                    )}
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08a970]">{plan.name}</p>
                                    <h3 className="mt-5 text-xl font-semibold">{plan.description}</h3>
                                    <div className="mt-8">
                                        <span className="text-3xl font-semibold">{plan.price}</span>
                                        <span className="ml-2 text-xs text-[#718078]">{plan.period}</span>
                                    </div>
                                    <ul className="mt-8 space-y-3 border-t border-[#dfe9e1] pt-6 text-sm text-[#64736c]">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <span className="text-[#08a970] font-bold">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link 
                                        href={route('register')} 
                                        className={`mt-9 block rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition ${
                                            plan.featured ? 'bg-[#173b2d] hover:bg-[#24543f] shimmer-btn' : 'bg-[#173b2d] hover:bg-[#24543f]'
                                        }`}
                                    >
                                        {plan.action} -&gt;
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ROI Section */}
                <section id="roi" className="px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
                        <SectionHeading 
                            eyebrow="Make the opportunity visible" 
                            title="Satu percakapan yang terlewat bisa jadi satu penjualan yang hilang." 
                            children="Gunakan estimasi sederhana ini untuk melihat nilai dari follow-up yang lebih konsisten." 
                        />
                        <div className="rounded-[26px] bg-[#173b2d] p-7 text-white sm:p-10 shadow-xl border border-[#1b5b46] shimmer-dark">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9f36d]">Potential recovered revenue</p>
                            <p className="mt-4 text-5xl font-extrabold text-[#c9f36d]">Rp 20.000.000</p>
                            <p className="mt-4 text-xs text-[#b9cec0]">Estimasi berdasarkan input contoh, bukan jaminan hasil.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="bg-white px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.7fr_1.3fr]">
                        <SectionHeading eyebrow="Good questions" title="Yang ingin Anda tahu sebelum mulai." />
                        <div className="border-t border-[#dfe9e1]">
                            {faqs.map((faq, index) => (
                                <div key={faq} className="border-b border-[#dfe9e1]">
                                    <button 
                                        type="button" 
                                        className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold" 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                                        aria-expanded={openFaq === index}
                                    >
                                        {faq}
                                        <span className="text-xl font-normal text-[#08a970]">{openFaq === index ? '−' : '+'}</span>
                                    </button>
                                    {openFaq === index && (
                                        <p className="pb-5 text-sm leading-6 text-[#718078]">
                                            WALEAD AI membantu tim penjualan memahami percakapan dan mengambil tindakan lebih cepat.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="bg-[#eaf8f2] px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#08a970]">Your next sale is in the conversation</p>
                            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-6xl">
                                Jangan biarkan chat yang masuk berakhir tanpa penjualan.
                            </h2>
                            <p className="mt-6 max-w-lg text-base leading-7 text-[#64736c]">
                                Biarkan WALEAD membantu tim Anda menemukan peluang yang sebelumnya terlewat.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link 
                                href={route('register')} 
                                className="rounded-xl bg-[#173b2d] px-6 py-4 text-center text-sm font-bold text-white shadow-md hover:bg-[#24543f] transition shimmer-btn"
                            >
                                Mulai Gratis -&gt;
                            </Link>
                            <Link 
                                href={auth.user ? route('dashboard') : route('login')} 
                                className="rounded-xl border border-[#b7d4c1] bg-white/70 px-6 py-4 text-center text-sm font-bold text-[#173b2d] hover:bg-white transition"
                            >
                                Lihat Demo
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
