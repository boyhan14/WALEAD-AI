import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Show({ customer, conversations, orders }: PageProps<{ customer: any, conversations: any, orders: any }>) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Customer: {customer.name}</h2>}>
            <Head title={customer.name} />
            <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8"><div className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-bold">Profile</h3>
                        <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
                        <p><strong>LTV:</strong> Rp{Number(customer.lifetime_value).toLocaleString('id-ID')}</p>
                        <div className="mt-4">
                            <h4 className="font-semibold">Tags</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {customer.tags?.map((t: any) => <span key={t.id} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">{t.name}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Recent Conversations</h3>
                        {conversations.length === 0 ? <p className="text-gray-500">No conversations.</p> : (
                            <ul className="space-y-3">
                                {conversations.map((c: any) => (
                                    <li key={c.id} className="border p-3 rounded dark:border-gray-700 flex justify-between">
                                        <span>Status: {c.status}</span>
                                        <Link href={`/inbox/${c.id}`} className="text-blue-500 hover:underline">View</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h3 className="text-lg font-bold mt-6 mb-4">Recent Orders</h3>
                        {orders.length === 0 ? <p className="text-gray-500">No orders.</p> : (
                            <ul className="space-y-3">
                                {orders.map((o: any) => (
                                    <li key={o.id} className="border p-3 rounded dark:border-gray-700 flex justify-between">
                                        <span>Order #{o.order_number} ({o.status})</span>
                                        <span className="font-bold">Rp{Number(o.total).toLocaleString('id-ID')}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div></div></div>
        </AuthenticatedLayout>
    );
}
