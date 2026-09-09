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
        <AuthenticatedLayout header={<div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08a970]">Revenue intelligence</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#17221d]">Good morning, {firstName}.</h2><p className="mt-2 text-sm text-[#718078]">Here is what is happening with your WhatsApp revenue today.</p></div>}>
            <Head title="Dashboard" />
            
            {!stats ? (
                <div className="py-12 text-center text-gray-500">
                    <p>Silahkan pilih atau buat workspace terlebih dahulu.</p>
                </div>
            ) : (
                <div className="py-10">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                        
                        {/* AI Insights Banner */}
                        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-l-4 border-emerald-500 p-5 rounded-r-xl shadow-sm dark:from-emerald-950/40 dark:to-blue-950/40">
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">✨</span>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">WALEAD AI Intelligence</h4>
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        Terdeteksi <strong>{stats.hot_leads} Hot Leads</strong> dengan intensi pembelian tinggi hari ini. 
                                        Ada <strong>{stats.pending_followups} follow-up otomatis</strong> menunggu persetujuan human-in-the-loop untuk mengamankan estimasi potensi pemulihan revenue.
                                    </p>
                                    <div className="mt-3 flex gap-3">
                                        <Link href="/approvals" className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition">
                                            Buka AI Approval Center &rarr;
                                        </Link>
                                        <Link href="/simulator" className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-xs font-semibold rounded-lg transition">
                                            Tes Customer Simulator
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    <span>Total Revenue</span>
                                    <span>💰</span>
                                </div>
                                <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                                    Rp{Number(stats.total_revenue || 0).toLocaleString('id-ID')}
                                </p>
                                <p className="mt-1 text-xs text-emerald-600 font-medium">Omset pesanan berhasil</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    <span>Recovered Revenue</span>
                                    <span>⚡</span>
                                </div>
                                <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    Rp{Number(stats.recovered_revenue || 0).toLocaleString('id-ID')}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">Diselamatkan oleh AI follow-up</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    <span>Hot Leads</span>
                                    <span>🔥</span>
                                </div>
                                <p className="mt-2 text-2xl font-black text-orange-600">
                                    {stats.hot_leads}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">Siap checkout & closing</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    <span>Conversations</span>
                                    <span>💬</span>
                                </div>
                                <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                                    {stats.open_conversations}
                                </p>
                                <p className="mt-1 text-xs text-blue-600 font-medium">{stats.total_customers} Total kontak pelanggan</p>
                            </div>
                        </div>

                        {/* Recent Leads Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">High Priority Leads</h3>
                                    <p className="text-xs text-gray-500">Lead dengan skor konversi tertinggi yang perlu segera di-follow up.</p>
                                </div>
                                <Link href="/customers" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                                    Lihat Semua Pelanggan &rarr;
                                </Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pelanggan</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Buying Intent</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lead Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status Suhu</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {recentLeads && recentLeads.length > 0 ? (
                                            recentLeads.map((lead) => (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-900 dark:text-white">{lead.customer?.name || 'Customer'}</div>
                                                        <div className="text-xs text-gray-500">{lead.customer?.phone || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                            {lead.intent || 'inquiry'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-black text-gray-800 dark:text-gray-100">
                                                        {lead.score} / 100
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                            lead.temperature === 'VERY_HOT' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
                                                            lead.temperature === 'HOT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' :
                                                            lead.temperature === 'WARM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}>
                                                            {lead.temperature}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                                                        <Link href="/inbox" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                                            Buka Chat &rarr;
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
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
