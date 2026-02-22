const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendEmail(opts: {
  hostname: string;
  port: number;
  username: string;
  password: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const conn = await Deno.connectTls({ hostname: opts.hostname, port: opts.port });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function readResponse(): Promise<string> {
    let result = "";
    const buf = new Uint8Array(4096);
    while (true) {
      const n = await conn.read(buf);
      if (!n) break;
      result += decoder.decode(buf.subarray(0, n));
      const lines = result.trim().split("\r\n");
      const lastLine = lines[lines.length - 1];
      if (/^\d{3} /.test(lastLine) || !/^\d{3}/.test(lastLine)) break;
    }
    return result;
  }

  async function send(cmd: string): Promise<string> {
    await conn.write(encoder.encode(cmd + "\r\n"));
    return await readResponse();
  }

  try {
    await readResponse();
    await send("EHLO localhost");
    const authResp = await send("AUTH LOGIN");
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed");
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH username failed");
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH password failed");
    await send(`MAIL FROM:<${opts.from}>`);
    await send(`RCPT TO:<${opts.to}>`);
    await send("DATA");

    const message = [
      `From: Avargo <${opts.from}>`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      opts.html,
      `.`,
    ].join("\r\n");

    await send(message);
    await send("QUIT");
  } finally {
    try { conn.close(); } catch { /* ignore */ }
  }
}

function buildWelcomeEmail(name: string, email: string, password: string, role: string) {
  const roleLabel = role === "admin" ? "administrator" : "medarbeider";
  const now = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:36px 32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">Velkommen til Avargo! 🎉</h1>
      <p style="color:#94a3b8;margin:10px 0 0;font-size:14px;">Vi gleder oss over å ha deg med på laget</p>
    </div>
    <div style="padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
      <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 16px;">
        Hei <strong>${name}</strong> 👋
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Vi ønsker deg hjertelig velkommen som ${roleLabel} i Avargo-teamet! Vi gleder oss virkelig til å få deg med på laget, og ser frem til alt vi skal utrette sammen. 🚀
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:24px;margin-bottom:24px;">
        <h2 style="margin:0 0 16px;font-size:14px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">🔐 Din innloggingsinformasjon</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;">Brukernavn (e-post)</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;">Midlertidig passord</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-family:monospace;background:#f1f5f9;padding:6px 10px;border-radius:6px;letter-spacing:1px;">${password}</td>
          </tr>
        </table>
      </div>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:24px;">
        <p style="font-size:13px;color:#92400e;margin:0;line-height:1.6;">
          ⚠️ <strong>Viktig:</strong> Vi anbefaler at du endrer passordet ditt etter første innlogging for din egen sikkerhet.
        </p>
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <a href="https://obsidian-edge-finance.lovable.app/admin/logg-inn" 
           style="display:inline-block;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
          Logg inn nå →
        </a>
      </div>

      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 8px;">
        Har du spørsmål eller trenger hjelp? Ikke nøl med å ta kontakt med oss – vi er her for deg! 😊
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0;">
        Vennlig hilsen,<br/><strong>Teamet i Avargo</strong>
      </p>

      <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra <strong>Avargo</strong> · ${now}</p>
      </div>
    </div>
  </div>`;
}

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

    // Send welcome email with credentials
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    if (smtpUser && smtpPass) {
      try {
        await sendEmail({
          hostname: "smtp.domeneshop.no",
          port: 465,
          username: smtpUser,
          password: smtpPass,
          from: "kontakt@avargo.no",
          to: email,
          subject: `Velkommen til Avargo, ${name}! 🎉`,
          html: buildWelcomeEmail(name, email, password, role || "employee"),
        });
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
        // Don't fail the whole request if email fails
      }
    }

    return new Response(JSON.stringify({ success: true, userId: newUser.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
