import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState, ReactNode } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Right panel with login form */}
            <div className="flex flex-col justify-center items-center p-4 sm:p-8 w-full lg:w-1/2 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo - shown only on small screens */}
                    <div className="lg:hidden flex justify-center items-center space-x-2 mb-8">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-600">
                            <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                fill="currentColor"
                                fillOpacity="0.7"
                            />
                            <path
                                d="M2 17L12 22L22 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 12L12 17L22 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xl font-bold">TaskFlow</span>
                    </div>

                    {/* Login form header */}
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-500">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Head title="Log in" />

                    {/* Login options */}
                    <div className="flex flex-col space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">
                                    Log in with email
                                </span>
                            </div>
                        </div>

                        <form className="flex flex-col space-y-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Password"
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ?
                                                <EyeOff className="h-4 w-4" /> :
                                                <Eye className="h-4 w-4" />
                                            }
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        tabIndex={3}
                                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-6 w-full flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Log in"
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        Or
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                    tabIndex={6}
                                >
                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                    tabIndex={7}
                                >
                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2"/>
                                    </svg>
                                    Continue with Facebook
                                </button>
                            </div>

                            <div className="text-center">
                                <div className="text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                                        tabIndex={8}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>

                    {status && (
                        <div className="mt-6 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        {status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
                    </p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <a href="#" className="hover:text-gray-700">Terms</a>
                        <a href="#" className="hover:text-gray-700">Privacy</a>
                        <a href="#" className="hover:text-gray-700">Contact</a>
                    </div>
                </div>
            </div>
            {/* Left panel with app showcase and screenshots */}
            <div className=" lg:block relative h-full w-1/2 bg-accent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 z-10" />

                {/* Diagonal pattern background */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="diagonalPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                                <rect width="100%" height="100%" fill="none"/>
                                <path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" stroke="white" strokeWidth="8"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
                    </svg>
                </div>

                <div className="absolute z-20 inset-0 flex flex-col p-12 text-white">
                    {/* Logo */}
                    loho here
                    {/* App showcase content */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-4">Streamline Your Workflow</h2>
                        <p className="text-lg text-white/80 max-w-md mb-8">
                            TaskFlow helps teams organize, prioritize, and complete work efficiently with beautiful kanban boards and powerful collaboration tools.
                        </p>
                    </div>

                    {/* App Screenshots - Floating UI Elements */}
                    <div className="relative flex-1">
                        {/* Main screenshot */}
                        <div className="absolute left-0 top-0 w-full max-w-lg transform transition-all duration-700 hover:scale-105 hover:-rotate-1">
                            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                                <div className="h-8 bg-gray-100 flex items-center px-4 border-b">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="mx-auto text-xs text-gray-500 font-medium">TaskFlow Dashboard</div>
                                </div>
                                <div className="p-2">
                                    <div className="flex space-x-2 h-[220px]">
                                        {/* To Do Column */}
                                        <div className="flex-1 bg-gray-100 rounded p-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-700">To Do</span>
                                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">3</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="bg-white p-2 rounded shadow text-xs text-gray-700">
                                                    <div className="font-medium">Update user documentation</div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="px-1 bg-blue-100 text-blue-800 rounded text-[10px]">Docs</span>
                                                        <span className="text-gray-500 text-[10px]">May 20</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 rounded shadow text-xs text-gray-700">
                                                    <div className="font-medium">Design new landing page</div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="px-1 bg-purple-100 text-purple-800 rounded text-[10px]">Design</span>
                                                        <span className="text-gray-500 text-[10px]">May 22</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* In Progress Column */}
                                        <div className="flex-1 bg-gray-100 rounded p-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-700">In Progress</span>
                                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">2</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="bg-white p-2 rounded shadow text-xs text-gray-700 border-l-2 border-yellow-500">
                                                    <div className="font-medium">Implement API endpoints</div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="px-1 bg-green-100 text-green-800 rounded text-[10px]">Backend</span>
                                                        <div className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">JD</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Done Column */}
                                        <div className="flex-1 bg-gray-100 rounded p-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-700">Completed</span>
                                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">4</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="bg-white p-2 rounded shadow text-xs text-gray-700 opacity-70">
                                                    <div className="font-medium line-through">Create wireframes</div>
                                                    <div className="flex justify-between mt-2">
                                                        <span className="px-1 bg-purple-100 text-purple-800 rounded text-[10px]">Design</span>
                                                        <div className="flex space-x-1">
                                                            <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating element - task details modal */}
                        <div className="absolute top-1/3 right-0 w-64 transform transition-all duration-700 hover:scale-105 hover:rotate-1 z-10">
                            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                                <div className="p-4 border-b">
                                    <div className="text-sm font-bold text-gray-800">Task Details</div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="text-xs text-gray-600">
                                        <div className="font-semibold text-gray-700 mb-1">Implement API endpoints</div>
                                        <p className="text-gray-600 text-[10px] mb-2">Create REST API endpoints for user authentication and profile management.</p>

                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-medium text-gray-500">Assigned to</span>
                                            <div className="flex">
                                                <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">JD</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-medium text-gray-500">Due date</span>
                                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">May 25</span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="text-[10px] font-medium text-gray-500 mb-1">Progress</div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                            <div className="text-right text-[10px] text-gray-500 mt-1">65%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating element - chart widget */}
                        <div className="absolute bottom-4 left-16 w-48 transform transition-all duration-700 hover:scale-105 hover:rotate-1 z-10">
                            <div className="bg-white rounded-lg shadow-xl overflow-hidden p-3">
                                <div className="text-[10px] font-bold text-gray-700 mb-2">Weekly Progress</div>
                                <div className="flex h-20 items-end space-x-2">
                                    <div className="flex-1 bg-blue-100 rounded-t" style={{ height: '30%' }}></div>
                                    <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '50%' }}></div>
                                    <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '70%' }}></div>
                                    <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '90%' }}></div>
                                    <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '60%' }}></div>
                                    <div className="flex-1 bg-blue-700 rounded-t" style={{ height: '75%' }}></div>
                                    <div className="flex-1 bg-blue-800 rounded-t" style={{ height: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-auto">
                        <blockquote className="text-lg italic font-medium border-l-4 border-white/30 pl-4">
                            "TaskFlow has transformed how our team manages projects. The intuitive interface makes collaboration effortless."
                        </blockquote>
                        <footer className="mt-4 flex items-center">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                SM
                            </div>
                            <div className="ml-3">
                                <div className="font-medium">Sara Mitchell</div>
                                <div className="text-sm opacity-80">Product Manager, Acme Inc.</div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>


        </div>
    );
}
