"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, onAuthStateChanged, FirebaseUser } from "@/src/lib/firebase";
import { supabase } from "@/src/lib/supabase";

export interface Profile {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    twitter_url: string | null;
    created_at: string;
}

interface AuthContextType {
    user: FirebaseUser | null;
    profile: Profile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    refreshProfile: async () => { },
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

async function getOrCreateProfile(user: FirebaseUser): Promise<Profile | null> {
    try {
        // Try to get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
            .from("botsnano_profiles")
            .select("*")
            .eq("id", user.uid)
            .single();

        if (existingProfile) {
            return existingProfile;
        }

        // If error is not "no rows" error, log it but continue to try creating
        if (fetchError && fetchError.code !== "PGRST116") {
            console.warn("Profile fetch warning:", fetchError.message);
        }

        // Create new profile if doesn't exist
        const username = user.email?.split("@")[0] || `user_${user.uid.slice(0, 8)}`;
        const { data: newProfile, error } = await supabase
            .from("botsnano_profiles")
            .insert({
                id: user.uid,
                username,
                display_name: user.displayName,
                avatar_url: user.photoURL,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating profile:", error.message, error.code, error.details);
            return null;
        }

        return newProfile;
    } catch (err) {
        console.error("Unexpected error in getOrCreateProfile:", err);
        return null;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (user) {
            const userProfile = await getOrCreateProfile(user);
            setProfile(userProfile);
        }
    };

    useEffect(() => {
        // Get auth instance - may be null if Firebase is not configured
        const authInstance = auth();

        // If no auth (Firebase not configured), just set loading to false
        if (!authInstance) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const userProfile = await getOrCreateProfile(firebaseUser);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

