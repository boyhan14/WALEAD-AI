import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#819087]">Start your workspace</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#17221c] dark:text-[#f4f1eb]">Make every lead count.</h2>
                <p className="mt-3 text-sm leading-6 text-[#718078] dark:text-[#a9b8ad]">Set up your account and bring your sales conversations into focus.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Your name" className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Work email" className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="pt-2">
                    <Link
                        href={route('login')}
                        className="mb-4 block text-center text-sm text-[#718078] dark:text-[#a9b8ad]"
                    >
                        Already have an account? <span className="font-bold text-[#173b2d] underline decoration-[#d8e75f] decoration-2 underline-offset-4 dark:text-[#d8e75f]">Sign in</span>
                    </Link>

                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Creating account...' : 'Create workspace account'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
