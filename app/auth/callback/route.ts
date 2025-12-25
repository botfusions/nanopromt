import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Güvenli redirect path kontrolü
function isValidRedirectPath(path: string): boolean {
    // Sadece yerel path'lere izin ver (/ ile başlamalı, // olmamalı)
    if (!path.startsWith('/')) return false;
    if (path.startsWith('//')) return false;
    // Protocol handler'ları engelle
    if (path.includes(':')) return false;
    // Backslash engelle
    if (path.includes('\\')) return false;
    return true;
}

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    // Open Redirect koruması
    const safePath = isValidRedirectPath(next) ? next : "/";

    if (code) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet: { name: string; value: string }[]) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${safePath}`);
        }
    }

    // Return to home on error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

