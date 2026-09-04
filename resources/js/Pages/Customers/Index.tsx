import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ customers }: PageProps<{ customers: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Customers
                </h2>
            }
        >
            <Head title="Customers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="mb-4 text-lg font-medium">Customer Directory</h3>
                            {customers.data.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No customers yet.</p>
                                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                                        Connect a sales channel and WALEAD will automatically track your customers.
                                    </p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Lifetime Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {customers.data.map((customer: any) => (
                                            <tr key={customer.id}>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{customer.name}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-gray-500">{customer.phone || '-'}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-gray-500">{customer.email || '-'}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">Rp{Number(customer.lifetime_value).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
