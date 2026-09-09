import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ conversations }: PageProps<{ conversations: any }>) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Inbox</h2>}>
            <Head title="Inbox" />
            <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8"><div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 h-[600px]">
                    <div className="md:col-span-1 border-r dark:border-gray-700 overflow-y-auto">
                        {conversations.data.length === 0 ? <p className="p-4 text-gray-500 text-sm">No active conversations</p> : null}
                        {conversations.data.map((c: any) => (
                            <Link key={c.id} href={`/inbox/${c.id}`} className="block p-4 border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{c.customer?.name || 'Unknown'}</h4>
                                <p className="text-sm text-gray-500 truncate">{c.latest_message?.content || 'No messages'}</p>
                                <span className="text-xs text-blue-500 font-medium">{c.status}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="md:col-span-3 flex items-center justify-center text-gray-500">
                        Select a conversation to view
                    </div>
                </div>
            </div></div></div>
        </AuthenticatedLayout>
    );
}
