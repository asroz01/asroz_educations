import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS  = ["/login", "/signup", "/register", "/pending", "/auth", "/setup"];
const PENDING_PATH  = "/pending";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path     = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));

  // Not logged in → /login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Logged in → check is_approved (skip for admins)
  if (user && !isPublic && path !== PENDING_PATH) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_approved, role")
      .eq("id", user.id)
      .single();

    // Not yet approved → holding page
    if (profile && !profile.is_approved && profile.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = PENDING_PATH;
      return NextResponse.redirect(url);
    }
  }

  // Logged-in user hitting /login → /dashboard
  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
