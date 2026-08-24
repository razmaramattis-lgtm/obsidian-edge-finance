import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

const CONFIRM_TEXT = "SLETT ALT";

interface Props {
  onWiped: () => void;
}

const WipeDatabaseButton = ({ onWiped }: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [wiping, setWiping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWipe = async () => {
    if (confirmText !== CONFIRM_TEXT) return;
    setWiping(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc("crm_wipe_leads" as never);
      if (rpcError) throw rpcError;
      setOpen(false);
      setConfirmText("");
      onWiped();
      const deleted = (data as { deleted?: number } | null)?.deleted;
      alert(
        deleted != null
          ? `Databasen er tømt. ${Number(deleted).toLocaleString("nb-NO")} selskaper er slettet.`
          : "Databasen er tømt."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noe gikk galt. Prøv igjen.");
    } finally {
      setWiping(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label="Tøm hele CRM-databasen"
      >
        <Trash2 size={14} className="mr-1.5" />
        Tøm database
      </Button>

      <AlertDialog open={open} onOpenChange={(o) => { if (!wiping) { setOpen(o); setConfirmText(""); setError(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} /> Tøm hele CRM-databasen?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>Dette sletter <b>permanent</b>:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Alle selskaper/kundekort i CRM</li>
                  <li>Alle mapper og mappemedlemskap</li>
                  <li>All e-posthistorikk knyttet til selskapene</li>
                </ul>
                <p>Importen nullstilles og starter på nytt fra dagens dato. Maler og autopilot-innstillinger beholdes.</p>
                <p className="font-medium text-foreground">Skriv <b>{CONFIRM_TEXT}</b> for å bekrefte:</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
            disabled={wiping}
            autoFocus
            className="border-destructive/40 focus-visible:ring-destructive/40"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={wiping}>Avbryt</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={confirmText !== CONFIRM_TEXT || wiping}
              onClick={handleWipe}
            >
              {wiping ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Trash2 size={14} className="mr-1.5" />}
              {wiping ? "Sletter …" : "Slett alt permanent"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WipeDatabaseButton;
