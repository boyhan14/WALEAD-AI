import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ actions }: PageProps<{ actions: any }>) {
    const handleAction = (id: number, status: 'APPROVED' | 'REJECTED') => {
        router.post(`/approvals/${id}`, { status });
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf8f1] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#08a970]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#08a970]"></span>
                            Human-in-the-Loop
                        </div>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#17221d]">
                            AI Approvals
                        </h2>
                        <p className="mt-1 text-xs text-[#64736c]">
                            Tinjau dan setujui tindakan otomatis bot AI sebelum pesan terkirim ke pelanggan.
                        </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        {actions.data.length} Menunggu Persetujuan
                    </span>
                </div>
            }
        >
            <Head title="AI Approvals" />
            
            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-[#e3eae6] bg-white p-6 sm:p-8 shadow-xl">
                        <div className="mb-6 flex items-center justify-between border-b border-[#e3eae6] pb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#17221d]">Daftar Aksi Tertunda</h3>
                                <p className="text-xs text-[#64736c] mt-0.5">Pesan atau aksi dengan tingkat risiko tinggi membutuhkan validasi tim CS.</p>
                            </div>
                        </div>

                        {actions.data.length === 0 ? (
                            <div className="py-16 text-center text-gray-400">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8f1] text-[#08a970]">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-[#17221d]">Semua Tindakan Beres!</h4>
                                <p className="text-xs text-gray-400 mt-1">Tidak ada aksi AI yang sedang menunggu persetujuan saat ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {actions.data.map((a: any) => {
                                    const isHigh = a.risk_level === 'HIGH';
                                    const payload = typeof a.payload === 'string' ? JSON.parse(a.payload) : a.payload;

                                    return (
                                        <div 
                                            key={a.id} 
                                            className={`rounded-2xl border p-5 shadow-xs transition ${
                                                isHigh 
                                                    ? 'border-red-200 bg-red-50/30 shimmer-light' 
                                                    : 'border-[#e3eae6] bg-[#fbfdfc] hover:bg-[#f7faf8]'
                                            }`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-2 max-w-2xl">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                            isHigh 
                                                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {isHigh && '🚨'} {a.risk_level} RISK
                                                        </span>
                                                        <span className="font-mono text-xs text-gray-500 font-semibold uppercase">
                                                            {a.action_type}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs font-medium text-gray-700">
                                                        <strong>Alasan:</strong> {a.reason}
                                                    </p>

                                                    {payload?.message && (
                                                        <div className="rounded-xl border border-[#e3eae6] bg-white p-3 text-xs text-[#17221d] shadow-2xs">
                                                            <span className="font-semibold text-gray-500 block mb-1">Draf Pesan Balasan:</span>
                                                            <p className="italic text-gray-800">"{payload.message}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2.5 shrink-0">
                                                    <button 
                                                        onClick={() => handleAction(a.id, 'REJECTED')} 
                                                        className="rounded-xl border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 shadow-2xs transition"
                                                    >
                                                        Tolak
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(a.id, 'APPROVED')} 
                                                        className="rounded-xl bg-[#123f32] hover:bg-[#0d2f25] px-5 py-2 text-xs font-bold text-[#c9f36d] shadow-sm transition shimmer-btn"
                                                    >
                                                        Setujui & Kirim
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
