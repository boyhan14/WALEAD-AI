import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useRef, useEffect } from 'react';

export default function Show({ conversation, messages }: PageProps<{ conversation: any, messages: any[] }>) {
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    };

    useEffect(() => {
        scrollToBottom(false);
    }, []);

    useEffect(() => {
        scrollToBottom(true);
    }, [messages]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim() || sending) return;

        setSending(true);
        router.post(`/inbox/${conversation.id}/messages`, { body }, {
            onSuccess: () => {
                setBody('');
                setSending(false);
            },
            onError: () => {
                setSending(false);
            }
        });
    };

    const customerInitials = (conversation.customer?.name || 'Customer')
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/inbox" 
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3eae6] bg-white px-3 py-1.5 text-xs font-semibold text-[#53635a] shadow-xs hover:bg-[#f1f7f4] hover:text-[#123f32] transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Inbox
                        </Link>
                        <h2 className="text-xl font-bold tracking-tight text-[#17221d]">
                            Chat: {conversation.customer?.name || 'Pelanggan'}
                        </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {conversation.status || 'OPEN'}
                    </span>
                </div>
            }
        >
            <Head title={`Inbox - ${conversation.customer?.name || 'Pelanggan'}`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main Chat Shell Container */}
                    <div className="overflow-hidden rounded-2xl border border-[#e3eae6] bg-white shadow-xl flex flex-col md:flex-row h-[78vh] min-h-[620px] max-h-[860px]">
                        
                        {/* Sidebar: Customer Info */}
                        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#e3eae6] bg-[#fbfdfc] flex flex-col justify-between shrink-0">
                            <div className="p-5 space-y-5 overflow-y-auto">
                                {/* Customer Card */}
                                <div className="text-center pb-5 border-b border-[#e3eae6]">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#123f32] text-[#c9f36d] text-xl font-extrabold shadow-sm">
                                        {customerInitials}
                                    </div>
                                    <h3 className="mt-3 text-base font-bold text-[#17221d]">
                                        {conversation.customer?.name || 'Pelanggan'}
                                    </h3>
                                    <p className="font-mono text-xs text-[#64736c] mt-0.5">
                                        {conversation.customer?.phone || 'Tanpa nomor'}
                                    </p>
                                    <div className="mt-2.5 flex justify-center gap-2">
                                        <span className="inline-flex items-center rounded-md bg-[#eaf8f1] px-2 py-0.5 text-xs font-medium text-[#08a970]">
                                            WhatsApp
                                        </span>
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                            {messages.length} Pesan
                                        </span>
                                    </div>
                                </div>

                                {/* Channel Details */}
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center text-[#64736c]">
                                        <span>Status Percakapan</span>
                                        <span className="font-semibold text-emerald-700">{conversation.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#64736c]">
                                        <span>Channel ID</span>
                                        <span className="font-mono font-medium text-gray-800">#{conversation.channel_id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#64736c]">
                                        <span>Terakhir Aktif</span>
                                        <span className="font-medium text-gray-800">
                                            {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Status Card */}
                                <div className="rounded-xl border border-[#d8ecd8] bg-[#f0f9f2] p-3.5 text-xs text-[#123f32] shimmer-light">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        <span className="text-base">✨</span>
                                        <span>AI Sales Assistant Aktif</span>
                                    </div>
                                    <p className="text-[#3b5d49] leading-relaxed">
                                        Setiap pesan masuk dianalisis niat belinya (*intent*) dan dijawab otomatis oleh AI dengan data katalog produk.
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Footer Link */}
                            <div className="p-4 border-t border-[#e3eae6] bg-white">
                                <Link 
                                    href="/simulator" 
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition"
                                >
                                    <span>🧪</span> Buka Customer Simulator
                                </Link>
                            </div>
                        </div>

                        {/* Right Area: Messages + Input Bar */}
                        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#f7f9f7]/40">
                            
                            {/* Chat Header */}
                            <div className="border-b border-[#e3eae6] bg-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
                                            {customerInitials}
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#17221d]">
                                            {conversation.customer?.name || 'Pelanggan'}
                                        </h4>
                                        <p className="text-[11px] text-gray-500">
                                            {conversation.customer?.phone ? `WhatsApp (${conversation.customer.phone})` : 'Online'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">
                                        Percakapan ID #{conversation.id}
                                    </span>
                                </div>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
                                {messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                                        <div className="rounded-full bg-gray-100 p-4 mb-3">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">Belum ada pesan dalam percakapan ini.</p>
                                    </div>
                                ) : (
                                    messages.map((m: any) => {
                                        const isOutbound = m.direction === 'OUTBOUND';
                                        const isAI = m.is_ai_generated;
                                        const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <div 
                                                key={m.id} 
                                                className={`flex items-end gap-2.5 ${isOutbound ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {/* Inbound Customer Avatar */}
                                                {!isOutbound && (
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-600">
                                                        {customerInitials}
                                                    </div>
                                                )}

                                                {/* Chat Bubble */}
                                                <div 
                                                    className={`relative max-w-[82%] sm:max-w-[65%] rounded-2xl px-4 py-3 shadow-xs break-words text-sm leading-relaxed ${
                                                        isOutbound
                                                            ? isAI
                                                                ? 'bg-[#123f32] text-white rounded-br-xs shimmer-dark'
                                                                : 'bg-[#08a970] text-white rounded-br-xs'
                                                            : 'bg-white text-[#17221d] border border-[#e3eae6] rounded-bl-xs'
                                                    }`}
                                                >
                                                    {/* Sender Label for Outbound */}
                                                    {isOutbound && (
                                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-1 opacity-90">
                                                            {isAI ? (
                                                                <span className="text-[#c9f36d] flex items-center gap-1">
                                                                    ✨ WALEAD AI Assistant
                                                                </span>
                                                            ) : (
                                                                <span className="text-white/90">
                                                                    👤 Customer Support
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <p className="whitespace-pre-wrap">{m.content}</p>

                                                    <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${isOutbound ? 'text-white/70' : 'text-gray-400'}`}>
                                                        <span>{timeStr}</span>
                                                        {isOutbound && (
                                                            <span title={m.provider_status || 'Sent'}>
                                                                {m.provider_status === 'FAILED' ? '⚠️' : '✓✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Outbound Avatar */}
                                                {isOutbound && (
                                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-xs ${isAI ? 'bg-[#123f32]' : 'bg-[#08a970]'}`}>
                                                        {isAI ? 'AI' : 'CS'}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Bottom Input Form */}
                            <div className="border-t border-[#e3eae6] bg-white p-3.5 sm:p-4 shrink-0">
                                <form onSubmit={submit} className="flex items-center gap-2 sm:gap-3">
                                    <input 
                                        type="text" 
                                        value={body} 
                                        onChange={e => setBody(e.target.value)} 
                                        placeholder="Ketik balasan untuk pelanggan..." 
                                        className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-[#17221d] placeholder:text-gray-400 shadow-inner transition focus:border-[#08b77a] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#08b77a]/15"
                                        disabled={sending}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={sending || !body.trim()}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123f32] px-5 py-2.5 text-sm font-bold text-[#c9f36d] shadow-sm hover:bg-[#0e3228] transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shimmer-btn"
                                    >
                                        {sending ? (
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                        ) : (
                                            <>
                                                <span>Kirim</span>
                                                <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
