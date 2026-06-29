window.RANKGRID_SUPABASE = null;

try {
  const RANKGRID_SUPABASE_URL = "https://nmlxcodtilehtdremrsg.supabase.co";

  const RANKGRID_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhjb2R0aWxlaHRkcmVtcnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzA0MjAsImV4cCI6MjA5ODMwNjQyMH0.9sWVFsrs6utQTN1tPHTJxe_N2UEkcAtXEhpirkXt9AY";

  if (
    window.supabase &&
    RANKGRID_SUPABASE_URL &&
    RANKGRID_SUPABASE_ANON_KEY &&
    !RANKGRID_SUPABASE_ANON_KEY.includes("PASTE_")
  ) {
    window.RANKGRID_SUPABASE = window.supabase.createClient(
      RANKGRID_SUPABASE_URL,
      RANKGRID_SUPABASE_ANON_KEY
    );
  } else {
    console.log("Supabase not configured correctly.");
  }
} catch (error) {
  console.log("Supabase config error:", error);
}
