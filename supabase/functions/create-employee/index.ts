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

function buildWelcomeEmail(name: string, email: string, password: string, role: string, approverName?: string, approverTitle?: string) {
  const isCustomer = role === "customer";
  const roleLabel = isCustomer ? "kunde" : role === "admin" ? "administrator" : "medarbeider";
  const loginUrl = isCustomer
    ? "https://obsidian-edge-finance.lovable.app/kunde/logg-inn"
    : "https://obsidian-edge-finance.lovable.app/admin/logg-inn";
  const portalName = isCustomer ? "kundeportalen" : "admin-portalen";
  const now = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  const firstName = name.split(" ")[0];
  const sigName = approverName || "Teamet i Avargo";
  const sigTitle = approverTitle ? `<br/>${approverTitle}` : "";

  return `<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <tr>
          <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
            <img src="https://obsidian-edge-finance.lovable.app/logo.png" alt="Avargo" width="120" style="display:inline-block;" />
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 20px 40px;">
            <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">Velkommen til Avargo, ${firstName}</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi er veldig glade for at du blir en del av teamet v&#229;rt. Vi ser virkelig frem til &#229; f&#229; jobbe sammen med deg, og er overbevist om at du vil bli en verdifull del av Avargo.</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Du har f&#229;tt tilgang til ${portalName} der du kan kommunisere med teamet, f&#229; tilgang til viktige dokumenter og holde deg oppdatert.</p>

            <div style="background:#f8fafc;border:1px solid #e4e4e7;border-radius:10px;padding:24px;margin:24px 0;">
              <p style="margin:0 0 16px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Din innloggingsinformasjon</p>
              <table style="border-collapse:collapse;width:100%;">
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Brukernavn (e-post)</td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Midlertidig passord</td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-family:monospace;background:#f1f5f9;padding:6px 10px;border-radius:6px;letter-spacing:1px;">${password}</td>
                </tr>
              </table>
            </div>

            <div style="background:#fef9c3;border-left:4px solid #eab308;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:24px;">
              <p style="font-size:13px;color:#854d0e;margin:0;line-height:1.6;">
                <strong>Viktig:</strong> Vi anbefaler at du endrer passordet ditt etter f&#248;rste innlogging for din egen sikkerhet.
              </p>
            </div>

            <div style="text-align:center;margin-bottom:24px;">
              <a href="${loginUrl}" 
                 style="display:inline-block;background-color:#1a1a1a;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
                Logg inn p&#229; ${portalName}
              </a>
            </div>

            <p style="margin:0 0 8px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Har du sp&#248;rsm&#229;l eller trenger hjelp? Ikke n&#248;l med &#229; ta kontakt med oss.</p>

            <p style="margin:28px 0 0 0;font-size:15px;line-height:1.7;color:#3a3a3a;">
              Med vennlig hilsen<br/>
              <strong>${sigName}</strong>${sigTitle}<br/>
              Avargo
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
          </td>
        </tr>

        <tr>
          <td style="padding:10px 40px 36px 40px;text-align:center;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#71717a;">
              <a href="https://www.avargo.no" style="color:#1a1a1a;text-decoration:none;font-weight:600;">www.avargo.no</a>
            </p>
            <p style="margin:0 0 6px 0;font-size:12px;color:#a1a1aa;">Oscars gate 2B, 3714 Skien</p>
            <p style="margin:0;font-size:12px;color:#a1a1aa;">kontakt@avargo.no</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { email, password, name, role, approver_name, approver_title } = await req.json();

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
          subject: `Velkommen til Avargo, ${name}!`,
          html: buildWelcomeEmail(name, email, password, role || "employee", approver_name, approver_title),
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
