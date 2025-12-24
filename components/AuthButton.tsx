"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/src/lib/firebase";
import { LogIn, LogOut, User, ChevronDown, Plus } from "lucide-react";

export function AuthButton() {
    const { user, profile, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setDropdownOpen(false);
    };

    if (loading) {
        return (
            <div className="w-8 h-8 bg-gray-200 border-2 border-brand-black animate-pulse" />
        );
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-yellow border-2 border-brand-black font-bold uppercase text-xs hover:bg-yellow-400 transition-colors"
            >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Giriş</span>
            </Link>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 border-2 border-brand-black bg-white hover:bg-gray-50 transition-colors"
            >
                {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "user"}
                        className="w-7 h-7 border border-brand-black object-cover"
                    />
                ) : (
                    <div className="w-7 h-7 bg-brand-yellow border border-brand-black flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </div>
                )}
                <span className="hidden sm:inline text-sm font-bold max-w-[100px] truncate">
                    @{profile?.username || user.email?.split("@")[0] || "user"}
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-brand-black shadow-neo z-50">
                    <div className="p-3 border-b-2 border-brand-black">
                        <p className="font-bold text-sm truncate">@{profile?.username || "user"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                        href="/prompt/new"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Prompt Ekle</span>
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Çıkış Yap</span>
                    </button>
                </div>
            )}
        </div>
    );
}
