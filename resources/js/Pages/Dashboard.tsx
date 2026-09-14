import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Stats {
    total_customers: number;
    hot_leads: number;
    open_conversations: number;
    total_revenue: number;
    pending_followups: number;
    recovered_revenue: number;
}

interface LeadItem {
    id: number;
    customer?: {
        name: string;
        phone: string;
    };
    intent: string;
    score: number;
    temperature: string;
}

export default function Dashboard({ stats, recentLeads }: PageProps<{ stats: Stats | null, recentLeads: LeadItem[] }>) {
    const user = usePage().props.auth.user;
    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf8f1] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#08a970]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#08a970]"></span>
                            Revenue Intelligence
                        </div>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17221d]">
                            Selamat datang, {firstName} 👋
                        </h2>
                        <p className="mt-1 text-sm text-[#64736c]">
                            Berikut performa penjualan dan analisis prospek WhatsApp bisnis Anda hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link 
                            href="/simulator" 
                            className="inline-flex items-center gap-2 rounded-xl border border-[#e3eae6] bg-white px-4 py-2.5 text-xs font-bold text-[#17221d] shadow-2xs hover:bg-[#f1f7f4] transition"
                        >
                            <span>🧪</span> Customer Simulator
                        </Link>
                        <Link 
                            href="/inbox" 
                            className="inline-flex items-center gap-2 rounded-xl bg-[#123f32] px-4 py-2.5 text-xs font-bold text-[#c9f36d] shadow-sm hover:bg-[#0e3228] transition"
                        >
                            <span>💬</span> Buka Inbox
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />
            
            {!stats ? (
                <div className="py-12 text-center text-gray-500">
                    <p>Silahkan pilih atau buat workspace terlebih dahulu.</p>
                </div>
            ) : (
                <div className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                        
                        {/* Premium AI Intelligence Banner */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#103b2e] via-[#123f32] to-[#092218] p-6 sm:p-8 text-white shadow-xl border border-[#1b5b46] shimmer-dark">
                            {/* Ambient Light Accent */}
                            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#08b77a]/25 blur-3xl"></div>
                            <div className="pointer-events-none absolute right-1/3 -bottom-20 h-48 w-48 rounded-full bg-[#c9f36d]/15 blur-2xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#c9f36d]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c9f36d] border border-[#c9f36d]/25">
                                        <span className="h-2 w-2 rounded-full bg-[#c9f36d] animate-pulse"></span>
                                        ✨ WALEAD AI Intelligence
                                    </div>
                                    
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                                        Terdeteksi <span className="text-[#c9f36d] underline decoration-[#c9f36d]/40 decoration-wavy underline-offset-4">{stats.hot_leads} Hot Leads</span> dengan intensi beli tinggi hari ini
                                    </h3>

                                    <p className="text-sm text-[#d2ede2] leading-relaxed">
                                        Ada <strong className="text-white font-semibold">{stats.pending_followups} tindak lanjut otomatis</strong> menunggu persetujuan <span className="text-[#c9f36d] font-semibold">human-in-the-loop</span> untuk mengamankan estimasi potensi pemulihan omset.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 shrink-0">
                                    <Link 
                                        href="/approvals" 
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#c9f36d] px-5 py-3 text-xs sm:text-sm font-extrabold text-[#123f32] shadow-sm hover:bg-[#d8f88a] transition transform hover:-translate-y-0.5 shimmer-btn"
                                    >
                                        <span>Buka AI Approval Center</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                    <Link 
                                        href="/simulator" 
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition"
                                    >
                                        Tes Simulator
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Top Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            {/* Metric 1: Total Revenue */}
                            <div className="rounded-2xl border border-[#e3eae6] bg-white p-6 shadow-xs hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#64736c]">Total Revenue</span>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#17221d]">
                                    Rp{Number(stats.total_revenue || 0).toLocaleString('id-ID')}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#08a970]">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Omset pesanan berhasil</span>
                                </div>
                            </div>

                            {/* Metric 2: Recovered Revenue */}
                            <div className="rounded-2xl border border-[#e3eae6] bg-white p-6 shadow-xs hover:shadow-md transition shimmer-light">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#64736c]">Recovered Revenue</span>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#08a970]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#08a970]">
                                    Rp{Number(stats.recovered_revenue || 0).toLocaleString('id-ID')}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#64736c]">
                                    <span>⚡ Diselamatkan AI follow-up</span>
                                </div>
                            </div>

                            {/* Metric 3: Hot Leads */}
                            <div className="rounded-2xl border border-[#e3eae6] bg-white p-6 shadow-xs hover:shadow-md transition shimmer-light">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#64736c]">Hot Leads</span>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        <span className="text-lg">🔥</span>
                                    </div>
                                </div>
                                <p className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-orange-600">
                                    {stats.hot_leads}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-orange-700">
                                    <span>Siap closing & checkout</span>
                                </div>
                            </div>

                            {/* Metric 4: Open Conversations */}
                            <div className="rounded-2xl border border-[#e3eae6] bg-white p-6 shadow-xs hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#64736c]">Conversations</span>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#17221d]">
                                    {stats.open_conversations}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#64736c]">
                                    <span>{stats.total_customers} Total kontak pelanggan</span>
                                </div>
                            </div>

                        </div>

                        {/* Recent Leads Table */}
                        <div className="overflow-hidden rounded-2xl border border-[#e3eae6] bg-white shadow-xs">
                            <div className="p-5 sm:p-6 border-b border-[#e3eae6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfdfc]">
                                <div>
                                    <h3 className="text-base font-bold text-[#17221d]">High Priority Leads</h3>
                                    <p className="text-xs text-[#64736c] mt-0.5">Daftar calon pelanggan dengan skor konversi tertinggi yang terdeteksi AI.</p>
                                </div>
                                <Link 
                                    href="/customers" 
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08a970] hover:text-[#068f5e] transition"
                                >
                                    <span>Lihat Semua Pelanggan</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#e3eae6] text-sm">
                                    <thead className="bg-[#f7f9f7]">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#64736c]">Pelanggan</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#64736c]">Buying Intent</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#64736c]">Lead Score</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#64736c]">Status Suhu</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[#64736c]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e3eae6]/60 bg-white">
                                        {recentLeads && recentLeads.length > 0 ? (
                                            recentLeads.map((lead) => {
                                                const initials = (lead.customer?.name || 'Customer')
                                                    .split(' ')
                                                    .map((n: string) => n[0])
                                                    .slice(0, 2)
                                                    .join('')
                                                    .toUpperCase();

                                                return (
                                                    <tr key={lead.id} className="hover:bg-[#f7faf8] transition">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#123f32] text-[#c9f36d] text-xs font-extrabold">
                                                                    {initials}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-[#17221d]">{lead.customer?.name || 'Pelanggan'}</div>
                                                                    <div className="text-xs text-[#64736c]">{lead.customer?.phone || '-'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                                                {lead.intent || 'inquiry'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-extrabold text-[#17221d]">{lead.score}</span>
                                                                <span className="text-xs text-gray-400">/ 100</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                                                                lead.temperature === 'VERY_HOT' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                                lead.temperature === 'HOT' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                                lead.temperature === 'WARM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                                            }`}>
                                                                {lead.temperature === 'VERY_HOT' && '🔥'}
                                                                {lead.temperature === 'HOT' && '⚡'}
                                                                {lead.temperature}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                                                            <Link 
                                                                href="/inbox" 
                                                                className="inline-flex items-center gap-1 rounded-lg bg-[#eaf8f1] px-3 py-1.5 font-bold text-[#08a970] hover:bg-[#d5f3e4] transition"
                                                            >
                                                                <span>Chat</span>
                                                                <span>&rarr;</span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                                    Belum ada lead terdaftar. Jalankan Customer Simulator untuk membuat data interaksi langsung.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
