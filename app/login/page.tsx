"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { Link } from "lucide-react";

type AuthMode = "social" | "login" | "signup";

export default function LoginPage() {
    const router = useRouter();
    const [authMode, setAuthMode] = useState<AuthMode>("social");

    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup form state
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth login

    };

    const handleAppleLogin = () => {
        // TODO: Implement Apple login

    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Handle login authentication

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();

            
        } catch (err) {

        }
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password match
        if (signupPassword !== signupConfirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // TODO: Handle user registration
        // Handle signup
        // console.log("Signup:", {
            // name: signupName,
            // email: signupEmail,
            // password: signupPassword,
        // });
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
                        <form
                            onSubmit={handleLoginSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="loginEmail"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    value={loginEmail}
                                    onChange={(e) =>
                                        setLoginEmail(e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="loginPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password{" "}
                                    <span className="text-brand-red">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    value={loginPassword}
                                    onChange={(e) =>
                                        setLoginPassword(e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 input-brand rounded-lg focus:ring-brand-blue transition"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 btn-brand-blue font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

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

                        <SocialLoginButtons />
                        <p className="text-sm text-center text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href="/signup"
                                className="text-brand-red font-semibold hover:underline"
                            >
                                Sign Up
                            </a>
                        </p>

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
    );
}
