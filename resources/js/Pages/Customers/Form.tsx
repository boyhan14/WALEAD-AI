import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ customer }: PageProps<{ customer?: any }>) {
    const isEdit = Boolean(customer);
    const { data, setData, post, put, processing, errors } = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        notes: customer?.notes || '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        isEdit ? put(route('customers.update', customer.id)) : post(route('customers.store'));
    };

    return <AuthenticatedLayout header={<div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08a970]">Customer directory</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#17221d]">{isEdit ? 'Edit customer' : 'Add a customer'}</h2></div>}>
        <Head title={isEdit ? 'Edit Customer' : 'Add Customer'} />
        <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 lg:py-10"><div className="surface-gloss rounded-3xl border border-[#e3eae6] p-6 sm:p-8"><form onSubmit={submit} className="space-y-6"><div><InputLabel htmlFor="name" value="Customer name" /><TextInput id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} className="mt-2 block w-full" required isFocused={!isEdit} /><InputError message={errors.name} className="mt-2" /></div><div><InputLabel htmlFor="phone" value="Phone number" /><TextInput id="phone" value={data.phone} onChange={(event) => setData('phone', event.target.value)} className="mt-2 block w-full" placeholder="62812..." required /><InputError message={errors.phone} className="mt-2" /></div><div><InputLabel htmlFor="email" value="Email" /><TextInput id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="mt-2 block w-full" /><InputError message={errors.email} className="mt-2" /></div><div><InputLabel htmlFor="notes" value="Notes" /><textarea id="notes" value={data.notes} onChange={(event) => setData('notes', event.target.value)} rows={4} className="mt-2 block w-full rounded-xl border-[#dce6df] bg-white/85 text-sm shadow-none focus:border-[#08b77a] focus:ring-[#08b77a]/20" placeholder="Context your team should remember..." /><InputError message={errors.notes} className="mt-2" /></div><div className="flex items-center gap-4 border-t border-[#e3eae6] pt-6"><PrimaryButton disabled={processing}>{processing ? 'Saving...' : isEdit ? 'Save customer' : 'Add customer'}</PrimaryButton><Link href={route('customers.index')} className="text-sm font-bold text-[#64736c] hover:text-[#123f32]">Cancel</Link></div></form></div></div>
    </AuthenticatedLayout>;
}
