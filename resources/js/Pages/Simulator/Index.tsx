import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const [phone, setPhone] = useState('6281234567890');
    const [name, setName] = useState('Budi Customer');
    const [message, setMessage] = useState('Halo kak, sepatu Nike hitam ukuran 42 masih ada?');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        router.post('/simulator', { phone, name, message }, {
            onSuccess: () => {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Customer Simulator</h2>}>
            <Head title="Simulator" />
            <div className="py-12"><div className="mx-auto max-w-7xl sm:px-6 lg:px-8"><div className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <h3 className="mb-4 text-lg font-medium">Simulate Incoming WhatsApp Message</h3>
                <p className="mb-6 text-gray-500">Use this to test the entire lead scoring, intent detection, and AI response flow without real Meta credentials.</p>
                
                {success && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">Message processed successfully! Check Inbox and Approvals.</div>}
                
                <form onSubmit={submit} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-medium">Customer Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Message Body</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm" required />
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Processing...' : 'Simulate Message'}
                    </button>
                </form>
            </div></div></div>
        </AuthenticatedLayout>
    );
}