const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "E-post, passord og navn er påkrevd." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Ikke autorisert." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const callerToken = authHeader.replace('Bearer ', '');
    const callerRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${callerToken}`, apikey: serviceKey }
    });
    const callerUser = await callerRes.json();
    if (!callerUser?.id) {
      return new Response(JSON.stringify({ error: "Ugyldig token." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${callerUser.id}&select=role`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey }
    });
    const profiles = await profileRes.json();
    if (!profiles?.[0] || profiles[0].role !== 'admin') {
      return new Response(JSON.stringify({ error: "Kun administrator kan opprette brukere." }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, email_confirm: true }),
    });

    const newUser = await createRes.json();
    if (newUser.error || !newUser.id) {
      return new Response(JSON.stringify({ error: newUser.error?.message || newUser.msg || "Kunne ikke opprette bruker." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ user_id: newUser.id, name, email, role: role || 'employee' }),
    });

    return new Response(JSON.stringify({ success: true, userId: newUser.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
