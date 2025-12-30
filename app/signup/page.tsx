"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // Validate password length
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }

        // TODO: Handle user registration
        console.log("Signup:", { name, email, password });
        // Navigate to the app
        router.push("/new_order");
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
            <div className="mx-auto w-full max-w-md">
                <div className="border-3 border-brand rounded-md px-6 pb-8 pt-4 bg-white shadow-lg">
                    {/* Heading overlay */}
                    <h2 className="relative -top-8 bg-white -left-3 w-fit px-3 text-2xl font-extrabold tracking-wider font-bungee rounded-xl">
                        SIGN UP
                    </h2>

                    <div className="space-y-6 -mt-4">
                        {/* Subtitle */}
                        <p className="text-center text-lg font-medium text-secondary">
                            Create your account
                        </p>

                        {/* Signup Form */}
                        <form
                            onSubmit={handleSignupSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Create a password (min. 8 characters)"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm Password{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 btn-brand-red font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl mt-3"
                            >
                                Sign Up
                            </button>
                        </form>

                        {/* Login link */}
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-brand-blue font-semibold hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                        {/* Terms and Privacy */}
                        <p className="text-xs text-center text-gray-500 mt-6">
                            By signing up, you agree to our{" "}
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
    );
}
