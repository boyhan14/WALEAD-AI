import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ conversations }: PageProps<{ conversations: any }>) {
    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-[#17221d]">Inbox Percakapan</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {conversations.data.length} Percakapan Aktif
                    </span>
                </div>
            }
        >
            <Head title="Inbox" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-[#e3eae6] bg-white shadow-xl flex flex-col md:flex-row h-[78vh] min-h-[620px] max-h-[860px]">
                        
                        {/* Conversation List Sidebar */}
                        <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-[#e3eae6] bg-[#fbfdfc] flex flex-col shrink-0">
                            <div className="p-4 border-b border-[#e3eae6] bg-white">
                                <h3 className="text-sm font-bold text-[#17221d]">Daftar Chat Masuk</h3>
                                <p className="text-xs text-gray-500">Pilih percakapan untuk melihat riwayat pesan</p>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-[#e3eae6]/60">
                                {conversations.data.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <p className="text-sm">Belum ada percakapan.</p>
                                        <p className="text-xs mt-1 text-gray-400">Gunakan Simulator untuk membuat percakapan uji coba.</p>
                                    </div>
                                ) : null}

                                {conversations.data.map((c: any) => {
                                    const initials = (c.customer?.name || 'Customer')
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase();

                                    return (
                                        <Link 
                                            key={c.id} 
                                            href={`/inbox/${c.id}`} 
                                            className="flex items-center gap-3 p-4 hover:bg-[#f1f7f4] transition group"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#123f32] text-[#c9f36d] text-sm font-extrabold shadow-2xs group-hover:scale-105 transition">
                                                {initials}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="text-sm font-bold text-[#17221d] truncate">
                                                        {c.customer?.name || 'Pelanggan'}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#64736c] truncate mt-0.5">
                                                    {c.latest_message?.content || 'Belum ada pesan'}
                                                </p>
                                            </div>

                                            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                                                {c.status}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Empty Selection State */}
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f7f9f7]/40 p-8 text-center text-gray-400">
                            <div className="h-16 w-16 rounded-2xl bg-white border border-[#e3eae6] flex items-center justify-center shadow-sm mb-4">
                                <svg className="w-8 h-8 text-[#08b77a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-[#17221d]">Pilih Percakapan</h3>
                            <p className="text-xs text-[#64736c] max-w-sm mt-1">
                                Klik salah satu percakapan di sebelah kiri untuk melihat pesan masuk, balasan AI Gemini, atau membalas pelanggan secara manual.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
