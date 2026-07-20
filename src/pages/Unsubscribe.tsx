import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "valid" | "invalid" | "already" | "success" | "error" | "submitting";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState("valid");
        else if (d.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    if (error) setState("error");
    else if (data?.success) setState("success");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <main className="min-h-screen bg-[#f6f1e8] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#1b5e4b]" />
            <p className="text-[#232d2a]">Sjekker lenken…</p>
          </>
        )}
        {state === "valid" && (
          <>
            <h1 className="text-2xl font-semibold text-[#1b5e4b] mb-3">Bekreft avmelding</h1>
            <p className="text-[#232d2a] mb-6">Klikk under for å melde deg av e-poster fra Avargo.</p>
            <Button onClick={confirm} className="bg-[#1b5e4b] hover:bg-[#1b5e4b]/90 rounded-full">
              Meld meg av
            </Button>
          </>
        )}
        {state === "submitting" && (
          <>
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#1b5e4b]" />
            <p>Behandler…</p>
          </>
        )}
        {(state === "success" || state === "already") && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-[#1b5e4b]" />
            <h1 className="text-2xl font-semibold text-[#1b5e4b] mb-2">
              {state === "success" ? "Du er avmeldt" : "Allerede avmeldt"}
            </h1>
            <p className="text-[#232d2a] mb-6">Du vil ikke motta flere e-poster fra Avargo.</p>
            <Button asChild variant="outline" className="rounded-full"><Link to="/">Til forsiden</Link></Button>
          </>
        )}
        {(state === "invalid" || state === "error") && (
          <>
            <XCircle className="mx-auto mb-4 h-10 w-10 text-red-600" />
            <h1 className="text-2xl font-semibold mb-2">Ugyldig lenke</h1>
            <p className="text-[#232d2a] mb-6">Lenken er ugyldig eller utløpt. Kontakt kontakt@avargo.no ved behov.</p>
            <Button asChild variant="outline" className="rounded-full"><Link to="/">Til forsiden</Link></Button>
          </>
        )}
      </div>
    </main>
  );
}
