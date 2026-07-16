import { useState, useMemo } from "react";
import { Calculator, Clock, TrendingUp } from "lucide-react";

/**
 * ROIMini — kompakt besparelseskalkulator for pris-siden.
 * Viser hvor mye tid/penger kunden sparer ved å outsource regnskap.
 */
const ROIMini = () => {
  const [employees, setEmployees] = useState(5);
  const [bilag, setBilag] = useState(80);

  const result = useMemo(() => {
    // Antagelser: 4 min per bilag, 30 min per ansatt/mnd lønn, 10 min per ansatt/mnd HR-spørsmål
    const minutesPerMonth = bilag * 4 + employees * 30 + employees * 10;
    const hours = Math.round(minutesPerMonth / 60);
    // Snitt timesats for SMB-leder: 750 kr
    const value = hours * 750;
    return { hours, value };
  }, [employees, bilag]);

  return (
    <div className="rounded-3xl glass border border-border/20 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Calculator size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-xl md:text-2xl">Hva sparer DU?</h3>
          <p className="text-xs text-foreground/50 font-light">Estimat basert på din bedrift</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/55 block mb-2 font-medium">
            Ansatte: <span className="text-foreground">{employees}</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-foreground/40 mt-1"><span>1</span><span>50</span></div>
        </div>
        <div>
          <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/55 block mb-2 font-medium">
            Bilag/mnd: <span className="text-foreground">{bilag}</span>
          </label>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={bilag}
            onChange={(e) => setBilag(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-foreground/40 mt-1"><span>10</span><span>500</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 pt-5 border-t border-border/15">
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={13} className="text-primary" />
            <p className="text-[10px] uppercase tracking-wider text-foreground/55 font-medium">Spart tid</p>
          </div>
          <p className="font-heading text-3xl md:text-4xl text-foreground">{result.hours}<span className="text-sm text-foreground/50 ml-1 font-sans">t/mnd</span></p>
        </div>
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp size={13} className="text-primary" />
            <p className="text-[10px] uppercase tracking-wider text-foreground/55 font-medium">Spart verdi</p>
          </div>
          <p className="font-heading text-3xl md:text-4xl text-foreground">{result.value.toLocaleString("nb-NO")}<span className="text-sm text-foreground/50 ml-1 font-sans">kr/mnd</span></p>
        </div>
      </div>
      <p className="text-[10px] text-foreground/40 font-light italic text-center mt-4">
        Estimat basert på 750 kr/t lederlønn. Faktisk besparelse varierer.
      </p>
    </div>
  );
};

export default ROIMini;
