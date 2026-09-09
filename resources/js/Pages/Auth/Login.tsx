import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-10">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#819087]">Welcome back</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#17221c] dark:text-[#f4f1eb]">Pick up where you left off.</h2>
                <p className="mt-3 text-sm leading-6 text-[#718078] dark:text-[#a9b8ad]">Sign in to see your conversations and keep momentum moving.</p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-[#c6dfaa] bg-[#eef7e5] px-4 py-3 text-sm font-medium text-[#3f6926]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Work email" className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" className="text-xs font-bold uppercase tracking-[0.12em] text-[#536258] dark:text-[#b8c6bb]" />
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-xs font-semibold text-[#47735a] transition hover:text-[#173b2d] dark:text-[#d8e75f] dark:hover:text-[#e4f274]">Forgot password?</Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="text-sm text-[#718078] dark:text-[#a9b8ad]">Keep me signed in</span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign in to workspace'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-8 text-center text-sm text-[#718078] dark:text-[#a9b8ad]">
                New to WALEAD? <Link href={route('register')} className="font-bold text-[#173b2d] underline decoration-[#d8e75f] decoration-2 underline-offset-4 dark:text-[#d8e75f]">Create an account</Link>
            </p>
        </GuestLayout>
    );
}
