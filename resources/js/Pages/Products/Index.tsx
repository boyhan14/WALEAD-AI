import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ products }: PageProps<{ products: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Products
                    </h2>
                    <Link
                        href={route('products.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        Create Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {products.data.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No products yet.</p>
                                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                                        Add your products so WALEAD can recommend them to customers.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.data.map((product: any) => (
                                        <div key={product.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 relative">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Link href={route('products.edit', product.id)}>
                                                        <h4 className="font-semibold text-blue-600 hover:underline">{product.name}</h4>
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                                                </div>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    product.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {product.status}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-lg font-bold">Rp{Number(product.price).toLocaleString('id-ID')}</p>
                                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
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
