import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Check {
    status: 'ok' | 'warning' | 'error';
    message: string;
}

interface Checks {
    database: Check;
    cache: Check;
    queue: Check;
    whatsapp: Check;
}

const statusIcon = (status: string) => {
    if (status === 'ok') return '🟢';
    if (status === 'warning') return '🟡';
    return '🔴';
};

export default function SystemHealth({ checks }: PageProps<{ checks: Checks }>) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">System Health</h2>}>
            <Head title="System Health" />
            <div className="py-12"><div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800 p-6">
                    <div className="space-y-4">
                        {Object.entries(checks).map(([name, check]) => (
                            <div key={name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{statusIcon(check.status)}</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{name}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{check.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div></div>
        </AuthenticatedLayout>
    );
}
