import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "E-post er påkrevd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    // Always return success to prevent user enumeration
    if (!user) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: normalizedEmail,
    });

    if (linkError || !linkData.properties?.action_link) {
      throw new Error(linkError?.message || "Kunne ikke generere sikker tilbakestillingslenke");
    }

    const wrappedLink = `https://avargo.no/auth/bekreft?to=${encodeURIComponent(linkData.properties.action_link)}`;

    const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "password-reset",
        recipientEmail: normalizedEmail,
        idempotencyKey: `reset-${user.id}-${Date.now()}`,
        templateData: {
          reset_link: wrappedLink,
          recipient_email: normalizedEmail,
        },
      },
    });

    if (emailErr) {
      console.error("send-transactional-email error:", emailErr);
      throw new Error("Kunne ikke sende e-post");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Kunne ikke tilbakestille passordet" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
