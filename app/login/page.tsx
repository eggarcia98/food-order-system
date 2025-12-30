"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth login
        console.log("Google login clicked");
    };

    const handleAppleLogin = () => {
        // TODO: Implement Apple login
        console.log("Apple login clicked");
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Handle guest user creation/session
        console.log("Guest login:", { name: guestName, email: guestEmail });
        // Navigate to the app
        router.push("/new_order");
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
            <div className="mx-auto w-full max-w-md">
                <div className="border-3 border-brand rounded-md px-6 pb-8 pt-4 bg-white shadow-lg">
                    {/* Heading overlay */}
                    <h2 className="relative -top-8 bg-white -left-3 w-fit px-3 text-2xl font-extrabold tracking-wider font-bungee rounded-xl">
                        WELCOME
                    </h2>

                    <div className="space-y-6 -mt-4">
                        {/* Subtitle */}
                        <p className="text-center text-lg font-medium text-secondary">
                            Sign in to continue
                        </p>

                        {/* Login Buttons */}
                        <div className="space-y-4">
                            {/* Google Login Button */}
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-brand-blue text-brand-blue font-semibold rounded-lg transition-all duration-200 hover:bg-brand-blue hover:text-white shadow-md hover:shadow-xl"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Apple Login Button */}
                            <button
                                onClick={handleAppleLogin}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-800 shadow-md hover:shadow-xl"
                            >
                                <svg
                                    className="w-5 h-5 fill-current"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Continue with Apple
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Guest option */}
                            {!showGuestForm ? (
                                <button
                                    onClick={() => setShowGuestForm(true)}
                                    className="w-full px-6 py-3 btn-brand-red font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
                                >
                                    Continue as Guest
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleGuestSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="guestName"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Name{" "}
                                            <span className="text-brand-red">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="guestName"
                                            value={guestName}
                                            onChange={(e) =>
                                                setGuestName(e.target.value)
                                            }
                                            required
                                            className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="guestEmail"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email (optional)
                                        </label>
                                        <input
                                            type="email"
                                            id="guestEmail"
                                            value={guestEmail}
                                            onChange={(e) =>
                                                setGuestEmail(e.target.value)
                                            }
                                            className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowGuestForm(false)
                                            }
                                            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 shadow-md"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 btn-brand-red font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Terms and Privacy */}
                            <p className="text-xs text-center text-gray-500 mt-6">
                                By continuing, you agree to our{" "}
                                <a
                                    href="#"
                                    className="text-brand-blue hover:underline"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="text-brand-blue hover:underline"
                                >
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
