import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ actions }: PageProps<{ actions: any }>) {
    const handleAction = (id: number, status: 'APPROVED' | 'REJECTED') => {
        router.post(`/approvals/${id}`, { status });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">AI Approvals</h2>}>
            <Head title="AI Approvals" />
            <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8"><div className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <h3 className="mb-4 text-lg font-medium">Pending Human Approval</h3>
                {actions.data.length === 0 ? <p className="text-gray-500">No pending actions.</p> : (
                    <div className="space-y-4">
                        {actions.data.map((a: any) => (
                            <div key={a.id} className="border p-4 rounded-lg dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${a.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{a.risk_level} RISK</span>
                                        <h4 className="font-bold mt-2">{a.action_type}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{a.reason}</p>
                                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs dark:bg-gray-900">{JSON.stringify(a.payload, null, 2)}</pre>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction(a.id, 'REJECTED')} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded">Reject</button>
                                        <button onClick={() => handleAction(a.id, 'APPROVED')} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded">Approve</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div></div></div>
        </AuthenticatedLayout>
    );
}
