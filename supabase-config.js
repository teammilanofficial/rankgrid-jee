window.RANKGRID_SUPABASE = null;

try {
  const RANKGRID_SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
  const RANKGRID_SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE";

  if (
    window.supabase &&
    RANKGRID_SUPABASE_URL &&
    RANKGRID_SUPABASE_ANON_KEY &&
    !RANKGRID_SUPABASE_URL.includes("PASTE_") &&
    !RANKGRID_SUPABASE_ANON_KEY.includes("PASTE_")
  ) {
    window.RANKGRID_SUPABASE = window.supabase.createClient(
      RANKGRID_SUPABASE_URL,
      RANKGRID_SUPABASE_ANON_KEY
    );
  } else {
    console.log("Supabase is not configured yet.");
  }
} catch (error) {
  console.log("Supabase config error:", error);
}
