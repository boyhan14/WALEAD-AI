import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface ChannelConfig {
    id: number;
    name: string;
    status: string;
    provider: string;
    phone_number_id: string | null;
    has_access_token: boolean;
    has_app_secret: boolean;
    webhook_url: string;
}

export default function WhatsApp({ channel }: PageProps<{ channel: ChannelConfig | null }>) {
    const [showForm, setShowForm] = useState(!channel);

    const { data, setData, post, processing, errors } = useForm({
        provider: channel?.provider || 'meta',
        phone_number_id: channel?.phone_number_id || '',
        access_token: '',
        app_secret: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.whatsapp.store'), {
            onSuccess: () => setShowForm(false),
        });
    };

    const testConnection = () => {
        router.post(route('settings.whatsapp.test'));
    };

    const isConnected = channel && channel.has_access_token && channel.phone_number_id;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">WhatsApp Integration</h2>}>
            <Head title="WhatsApp Settings" />
            <div className="py-12"><div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800 p-6">
                    {/* Status Banner */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {isConnected ? 'Connected' : 'Not Connected'}
                            </span>
                        </div>
                        {channel && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Provider: {channel.provider === 'meta' ? 'Meta WhatsApp Cloud API' : 'Mock (Development)'}
                            </span>
                        )}
                    </div>

                    {/* Channel Details */}
                    {channel && !showForm && (
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number ID</p>
                                    <p className="font-mono text-gray-900 dark:text-gray-100">{channel.phone_number_id || '—'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Access Token</p>
                                    <p className="font-mono text-gray-900 dark:text-gray-100">{channel.has_access_token ? '••••••••••••' : 'Not set'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">App Secret</p>
                                    <p className="font-mono text-gray-900 dark:text-gray-100">{channel.has_app_secret ? '••••••••••••' : 'Not set'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Webhook URL</p>
                                    <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{channel.webhook_url}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Configure
                                </button>
                                <button onClick={testConnection} className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                                    Test Connection
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Configuration Form */}
                    {showForm && (
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
                                <select
                                    value={data.provider}
                                    onChange={e => setData('provider', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="meta">Meta WhatsApp Cloud API</option>
                                    <option value="mock">Mock (Development)</option>
                                </select>
                            </div>

                            {data.provider === 'meta' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number ID</label>
                                        <input
                                            type="text"
                                            value={data.phone_number_id}
                                            onChange={e => setData('phone_number_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="e.g. 123456789012345"
                                        />
                                        {errors.phone_number_id && <p className="text-sm text-red-500 mt-1">{errors.phone_number_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Access Token</label>
                                        <input
                                            type="password"
                                            value={data.access_token}
                                            onChange={e => setData('access_token', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder={channel?.has_access_token ? 'Leave blank to keep current' : 'Paste your access token'}
                                        />
                                        {errors.access_token && <p className="text-sm text-red-500 mt-1">{errors.access_token}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">App Secret (for webhook signature validation)</label>
                                        <input
                                            type="password"
                                            value={data.app_secret}
                                            onChange={e => setData('app_secret', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder={channel?.has_app_secret ? 'Leave blank to keep current' : 'Paste your app secret'}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Save Configuration'}
                                </button>
                                {channel && (
                                    <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div></div>
        </AuthenticatedLayout>
    );
}
