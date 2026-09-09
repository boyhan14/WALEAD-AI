import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

export default function Show({ conversation, messages }: PageProps<{ conversation: any, messages: any }>) {
    const [body, setBody] = useState('');
    
    const submit = (e: any) => {
        e.preventDefault();
        router.post(`/inbox/${conversation.id}/messages`, { body }, {
            onSuccess: () => setBody('')
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Inbox - {conversation.customer?.name}</h2>}>
            <Head title={`Inbox - ${conversation.customer?.name}`} />
            <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8"><div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 h-[600px]">
                    <div className="md:col-span-1 border-r dark:border-gray-700 p-4">
                        <Link href="/inbox" className="text-blue-500 mb-4 inline-block">&larr; Back</Link>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{conversation.customer?.name}</h3>
                        <p className="text-sm text-gray-500">Status: {conversation.status}</p>
                    </div>
                    <div className="md:col-span-3 flex flex-col h-full">
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((m: any) => (
                                <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${m.direction === 'OUTBOUND' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}`}>
                                        <p>{m.content}</p>
                                        <span className="text-xs opacity-75 mt-1 block">{new Date(m.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t dark:border-gray-700 mt-auto">
                            <form onSubmit={submit} className="flex gap-2">
                                <input type="text" value={body} onChange={e => setBody(e.target.value)} className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Type a message..." />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div></div></div>
        </AuthenticatedLayout>
    );
}
