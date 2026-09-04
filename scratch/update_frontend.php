<?php

$pages = [
    'Customers/Index.tsx' => <<<'TSX'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ auth, customers }: PageProps<{ customers: any }>) {
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
                                <p className="text-gray-500">No customers found.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">LTV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {customers.data.map((customer: any) => (
                                            <tr key={customer.id}>
                                                <td className="whitespace-nowrap px-6 py-4">{customer.name}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{customer.email || '-'}</td>
                                                <td className="whitespace-nowrap px-6 py-4">Rp {customer.lifetime_value}</td>
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
TSX,

    'Products/Index.tsx' => <<<'TSX'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ auth, products }: PageProps<{ products: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="mb-4 text-lg font-medium">Product Catalog</h3>
                            {products.data.length === 0 ? (
                                <p className="text-gray-500">No products found.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.data.map((product: any) => (
                                        <div key={product.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                            <h4 className="font-semibold">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                                            <p className="mt-2 text-lg font-bold">Rp {product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
TSX,

    'Orders/Index.tsx' => <<<'TSX'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ auth, orders }: PageProps<{ orders: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="mb-4 text-lg font-medium">Order History</h3>
                            {orders.data.length === 0 ? (
                                <p className="text-gray-500">No orders found.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order #</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {orders.data.map((order: any) => (
                                            <tr key={order.id}>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{order.order_number}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{order.customer?.name || 'Guest'}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{order.status}</td>
                                                <td className="whitespace-nowrap px-6 py-4">Rp {order.total}</td>
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
TSX,
];

foreach ($pages as $path => $content) {
    file_put_contents("D:\WALEAD AI\resources\js\Pages\\$path", $content);
    echo "Updated $path\n";
}
