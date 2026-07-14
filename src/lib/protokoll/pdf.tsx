// PDF-rendering for protokoller og generalforsamlingsdokumenter.
// Bruker @react-pdf/renderer og produserer juridisk formaterte dokumenter.

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CompanyProfile, DocumentState, SakModulValg } from "./types";
import { sakModuler } from "./types";

// Fonter — bruker Times-Roman som er innebygget og støtter norske tegn
const styles = StyleSheet.create({
  page: {
    paddingTop: 56,   // 20mm
    paddingBottom: 56,
    paddingLeft: 71,  // 25mm
    paddingRight: 56,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    lineHeight: 1.45,
    color: "#111827",
  },
  title: { fontFamily: "Times-Bold", fontSize: 20, marginBottom: 4 },
  subtitle: { fontSize: 12, marginBottom: 18, color: "#374151" },
  section: { fontFamily: "Times-Bold", fontSize: 12, marginTop: 14, marginBottom: 6 },
  paragraph: { marginBottom: 6 },
  metaRow: { flexDirection: "row", marginBottom: 3 },
  metaLabel: { width: 120, color: "#4b5563" },
  metaValue: { flex: 1 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#d1d5db", paddingVertical: 3 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#374151", paddingVertical: 4, marginTop: 6, marginBottom: 2 },
  tableCell: { flex: 1, paddingRight: 8 },
  tableCellSmall: { width: 90, paddingRight: 8 },
  placeholder: {
    backgroundColor: "#E4E9FB",
    color: "#3B4CC7",
    paddingHorizontal: 2,
  },
  signatureLine: {
    borderTopWidth: 0.5,
    borderTopColor: "#111827",
    marginTop: 40,
    paddingTop: 4,
    width: 220,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 71,
    right: 56,
    fontSize: 8,
    color: "#9CA3AF",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const PH = ({ children, hint }: { children?: string | number; hint: string }) => {
  const value = children;
  const isEmpty = value === undefined || value === null || value === "" || value === 0;
  if (isEmpty) {
    return <Text style={styles.placeholder}>[{hint}]</Text>;
  }
  return <Text>{String(value)}</Text>;
};

const nokFormat = (v: number) => {
  if (!v) return 0;
  return new Intl.NumberFormat("nb-NO").format(v) + " kr";
};

// ---------- Sak-modul rendering ----------

function SakModulBlock({ valg, sakstall }: { valg: SakModulValg; sakstall: number }) {
  const def = sakModuler.find(s => s.id === valg.id);
  if (!def) return null;
  const d = valg.data;

  const body = (() => {
    switch (valg.id) {
      case "valg_revisor":
        return d.har_revisor ? (
          <Text>
            Generalforsamlingen/styret vedtok å velge <PH hint="revisor">{d.revisor_navn as string}</PH>
            {" "}(org.nr. <PH hint="org.nr revisor">{d.revisor_orgnr as string}</PH>) som selskapets revisor,
            med tiltredelse fra <PH hint="dato">{d.tiltredelsesdato as string}</PH>. Godtgjørelse: {(d.godtgjorelse as string) || "etter regning"}.
          </Text>
        ) : (
          <Text>
            Generalforsamlingen vedtok, i medhold av aksjeloven § 7-6, at selskapet ikke skal ha revisor.
          </Text>
        );
      case "styreendring":
        return (
          <Text>
            Følgende endring i styrets sammensetning ble vedtatt med virkning fra{" "}
            <PH hint="dato">{d.dato_endring as string}</PH>. Uttredende: <PH hint="navn">{d.navn_uttredende as string}</PH>.
            Inntredende: <PH hint="navn">{d.navn_inntredende as string}</PH>,{" "}
            <PH hint="rolle">{d.rolle_inntredende as string}</PH>.
            {d.meld_brreg ? " Endringen meldes til Foretaksregisteret." : ""}
          </Text>
        );
      case "disponering_arsresultat":
        return (
          <View>
            <Text>Årets resultat: {nokFormat(d.arets_resultat as number)}</Text>
            <Text>Utbytte: {nokFormat(d.utbytte as number)}</Text>
            <Text>Overføring til annen egenkapital: {nokFormat(d.overforing as number)}</Text>
            {d.fritekst ? <Text style={{ marginTop: 4 }}>{d.fritekst as string}</Text> : null}
          </View>
        );
      case "konsernbidrag":
        return (
          <Text>
            Det ble vedtatt å yte konsernbidrag på {nokFormat(d.belop as number)} fra{" "}
            <PH hint="giver">{d.giver_navn as string}</PH> (org.nr. <PH hint="orgnr">{d.giver_orgnr as string}</PH>)
            til <PH hint="mottaker">{d.mottaker_navn as string}</PH> (org.nr.{" "}
            <PH hint="orgnr">{d.mottaker_orgnr as string}</PH>) for regnskapsåret{" "}
            <PH hint="år">{d.regnskapsar as string}</PH>, jf. aksjeloven § 8-5 og skatteloven § 10-2 flg.
            {d.skattemessig_virkning ? " Konsernbidraget gis med skattemessig virkning." : ""}
          </Text>
        );
      case "lan_selskap_aksjonaer":
        return (
          <Text>
            Det ble vedtatt at <PH hint="långiver">{d.langiver as string}</PH> yter lån til{" "}
            <PH hint="låntaker">{d.lantaker as string}</PH> på {nokFormat(d.belop as number)}, med rentesats{" "}
            <PH hint="rente">{d.rentesats as number}</PH> % p.a. og forfall{" "}
            <PH hint="dato">{d.forfallsdato as string}</PH>.
            {d.sikkerhet ? ` Sikkerhet: ${d.sikkerhet as string}.` : ""} Styret har vurdert låntakers kredittverdighet og
            selskapets evne til å yte lånet innenfor rammen av fri egenkapital, jf. aksjeloven § 8-7.
          </Text>
        );
      case "valg_daglig_leder":
        return (
          <Text>
            <PH hint="navn">{d.navn as string}</PH> ble valgt som daglig leder med tiltredelse{" "}
            <PH hint="dato">{d.tiltredelsesdato as string}</PH>.
            {d.fratredende ? ` ${d.fratredende as string} fratrer stillingen som daglig leder samme dato.` : ""}
          </Text>
        );
      case "utbytte_ekstraordinaert":
        return (
          <Text>
            Generalforsamlingen vedtok utdeling av utbytte på {nokFormat(d.belop as number)} med utdelingsdato{" "}
            <PH hint="dato">{d.utdelingsdato as string}</PH>, basert på{" "}
            <PH hint="grunnlag">{d.grunnlag as string}</PH>, jf. aksjeloven § 8-2.
          </Text>
        );
      case "vedtektsendring":
        return (
          <View>
            <Text>Vedtektsendring — <PH hint="paragraf">{d.paragraf as string}</PH></Text>
            <Text style={{ marginTop: 3 }}>Gammel ordlyd: {(d.gammel_ordlyd as string) || "—"}</Text>
            <Text>Ny ordlyd: {(d.ny_ordlyd as string) || "—"}</Text>
            {d.begrunnelse ? <Text style={{ marginTop: 3 }}>Begrunnelse: {d.begrunnelse as string}</Text> : null}
          </View>
        );
      case "kapitalendring":
        return (
          <Text>
            Aksjekapitalen endres med {nokFormat(d.belop as number)}, ved utstedelse av{" "}
            <PH hint="antall">{d.antall_aksjer as number}</PH> nye aksjer til tegningskurs{" "}
            {nokFormat(d.tegningskurs as number)}. Tegner: <PH hint="tegner">{d.tegner as string}</PH>.
            Innbetalingsform: <PH hint="form">{d.innbetalingsform as string}</PH>.
          </Text>
        );
      case "fritekst_sak":
        return (
          <View>
            {d.beskrivelse ? <Text style={{ marginBottom: 3 }}>{d.beskrivelse as string}</Text> : null}
            {d.vedtak ? (
              <Text>
                <Text style={{ fontFamily: "Times-Bold" }}>Vedtak: </Text>
                {d.vedtak as string}
              </Text>
            ) : null}
          </View>
        );
      default:
        return null;
    }
  })();

  const title = valg.id === "fritekst_sak" && d.overskrift ? (d.overskrift as string) : def.tittel;

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.section}>{sakstall}. {title}</Text>
      <View style={styles.paragraph}>{body}</View>
    </View>
  );
}

// ---------- Felles hjelpere ----------

function CompanyHeader({ profile, tittel }: { profile: CompanyProfile; tittel: string }) {
  return (
    <View>
      <Text style={styles.title}>{tittel}</Text>
      <Text style={styles.subtitle}>
        i <PH hint="selskapsnavn">{profile.selskap.navn}</PH>
        {"  org.nr. "}
        <PH hint="org.nr">{profile.selskap.orgnummer}</PH>
      </Text>
    </View>
  );
}

function MoteInfo({ profile, includeMotenr }: { profile: CompanyProfile; includeMotenr?: boolean }) {
  return (
    <View style={{ marginBottom: 8 }}>
      {includeMotenr && (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Møte nr.:</Text>
          <Text style={styles.metaValue}><PH hint="nr">{profile.moteinfo.motenr}</PH></Text>
        </View>
      )}
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Dato:</Text>
        <Text style={styles.metaValue}><PH hint="dato">{profile.moteinfo.dato}</PH></Text>
      </View>
      {profile.moteinfo.klokkeslett ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Klokkeslett:</Text>
          <Text style={styles.metaValue}>{profile.moteinfo.klokkeslett}</Text>
        </View>
      ) : null}
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Møteform / sted:</Text>
        <Text style={styles.metaValue}><PH hint="sted eller møteform">{profile.moteinfo.sted_eller_moteform}</PH></Text>
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text>Protokoll- og generalforsamlingsgenerator er produsert av Avargo.</Text>
      <Text render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
    </View>
  );
}

// ---------- Dokumenttype: Styremøteprotokoll ----------

function StyremoteProtokoll({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const a = doc.answers;
  let sakstall = 5;
  return (
    <>
      <CompanyHeader profile={profile} tittel="Protokoll fra styremøte" />
      <MoteInfo profile={profile} includeMotenr />

      <Text style={styles.section}>Deltakere</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Navn</Text>
        <Text style={styles.tableCellSmall}>Rolle</Text>
        <Text style={styles.tableCellSmall}>Deltok</Text>
      </View>
      {profile.styre.styremedlemmer.length === 0 ? (
        <Text style={styles.placeholder}>[Legg til styremedlemmer i selskapsprofilen]</Text>
      ) : (
        profile.styre.styremedlemmer.map((m, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{m.navn || "—"}</Text>
            <Text style={styles.tableCellSmall}>{m.rolle || "medlem"}</Text>
            <Text style={styles.tableCellSmall}>{m.deltok === false ? "Nei" : "Ja"}</Text>
          </View>
        ))
      )}

      <Text style={[styles.paragraph, { marginTop: 10 }]}>
        Styret var beslutningsdyktig, jf. aksjeloven § 6-24. Styrets leder åpnet møtet.
        Det var ingen innvendinger mot sakslisten, og styremøtet ble erklært lovlig satt.
      </Text>

      <Text style={styles.section}>1. Godkjenning av innkalling og dagsorden</Text>
      <Text style={styles.paragraph}>Innkalling og dagsorden ble godkjent.</Text>

      <Text style={styles.section}>2. Gjennomgang av referat fra forrige styremøte</Text>
      <Text style={styles.paragraph}>Referat fra forrige styremøte ble gjennomgått og signert.</Text>

      <Text style={styles.section}>3. Gjennomgang av forslag til årsregnskap</Text>
      <Text style={styles.paragraph}>
        Årsregnskapet ble gjennomgått av daglig leder / styrets leder.{"\n"}
        <Text style={{ fontFamily: "Times-Bold" }}>Vedtak:</Text> Det fremlagte forslaget til årsregnskap ble
        enstemmig godkjent av styret. Regnskapet fremlegges for generalforsamlingen som styrets forslag.
      </Text>

      <Text style={styles.section}>4. Disponering av resultat</Text>
      {a.disponering_type === "fritekst" && a.fritekst_disponering ? (
        <Text style={styles.paragraph}>{a.fritekst_disponering as string}</Text>
      ) : (
        <View style={styles.paragraph}>
          <Text>Årets resultat: {nokFormat(profile.regnskap.arets_resultat)}</Text>
          <Text>Utbytte: {nokFormat(profile.regnskap.utbytte)}</Text>
          <Text>Overføring til annen egenkapital: {nokFormat(profile.regnskap.overforing_annen_egenkapital)}</Text>
        </View>
      )}

      {doc.sub_sections.map((s, i) => (
        <SakModulBlock key={i} valg={s} sakstall={sakstall++} />
      ))}

      {a.revisors_rapport ? (
        <>
          <Text style={styles.section}>{sakstall++}. Behandling av revisors rapport</Text>
          <Text style={styles.paragraph}>Revisors rapport ble gjennomgått og tatt til orientering.</Text>
        </>
      ) : null}

      {a.lovpalagt_revisormote ? (
        <>
          <Text style={styles.section}>{sakstall++}. Lovpålagt møte med revisor</Text>
          <Text style={styles.paragraph}>
            Styret gjennomførte lovpålagt møte med revisor uten daglig leders tilstedeværelse, jf. aksjeloven § 6-19.
          </Text>
        </>
      ) : null}

      {a.innkalling_gf ? (
        <>
          <Text style={styles.section}>{sakstall++}. Innkalling til generalforsamling</Text>
          <Text style={styles.paragraph}>
            Styret vedtok å innkalle til ordinær generalforsamling. Innkalling utarbeides og sendes i tråd med
            aksjelovens bestemmelser.
          </Text>
        </>
      ) : null}

      {a.avstemmingsresultat ? (
        <>
          <Text style={styles.section}>{sakstall}. Resultat fra avstemminger</Text>
          <Text style={styles.paragraph}>{a.avstemmingsresultat as string}</Text>
        </>
      ) : null}

      <View style={{ marginTop: 30 }}>
        <Text>Sted: ______________________     Dato: <PH hint="dato">{a.signatur_dato as string}</PH></Text>
        {(profile.styre.styremedlemmer.length > 0 ? profile.styre.styremedlemmer : [{ navn: "", rolle: "" }]).map((m, i) => (
          <View key={i} style={styles.signatureLine}>
            <Text>{m.navn || "________________________"}{m.rolle ? `, ${m.rolle}` : ""}</Text>
            {a.signatur_metode === "elektronisk" ? <Text style={{ fontSize: 8, color: "#6b7280" }}>(Signert elektronisk)</Text> : null}
          </View>
        ))}
      </View>
    </>
  );
}

// ---------- Dokumenttype: Innkalling styremøte ----------

function InnkallingStyremote({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const a = doc.answers;
  return (
    <>
      <CompanyHeader profile={profile} tittel="Innkalling til styremøte" />
      <MoteInfo profile={profile} />

      <Text style={styles.section}>Saksliste</Text>
      <Text style={styles.paragraph}>1. Godkjenning av innkalling og dagsorden</Text>
      <Text style={styles.paragraph}>2. Gjennomgang og signatur av referat fra forrige styremøte</Text>
      <Text style={styles.paragraph}>3. Gjennomgang av forslag til årsregnskap{profile.regnskap.har_arsberetning ? " og årsberetning" : ""}</Text>
      <Text style={styles.paragraph}>4. Disponering av resultat</Text>
      {a.revisors_rapport ? <Text style={styles.paragraph}>5. Behandling av revisors rapport</Text> : null}
      {a.lovpalagt_revisormote ? <Text style={styles.paragraph}>6. Lovpålagt møte med revisor, jf. aksjeloven § 6-19</Text> : null}
      {a.innkalling_gf !== false ? <Text style={styles.paragraph}>7. Innkalling til ordinær generalforsamling</Text> : null}
      {doc.sub_sections.map((s, i) => {
        const def = sakModuler.find(sm => sm.id === s.id);
        const title = s.id === "fritekst_sak" && s.data.overskrift ? (s.data.overskrift as string) : def?.tittel || "Sak";
        return <Text key={i} style={styles.paragraph}>{8 + i}. {title}</Text>;
      })}

      <Text style={[styles.paragraph, { marginTop: 14 }]}>
        Ved forfall bes styremedlem gi beskjed så snart som mulig til styrets leder på{" "}
        <PH hint="e-post">{profile.styre.styreleder.epost}</PH>
        {profile.styre.styreleder.telefon ? ` eller tlf. ${profile.styre.styreleder.telefon}` : ""}.
      </Text>

      <View style={{ marginTop: 40 }}>
        <Text>Sted: <PH hint="sted">{a.signatur_sted as string}</PH>     Dato: <PH hint="dato">{a.signatur_dato as string}</PH></Text>
        <View style={styles.signatureLine}>
          <Text><PH hint="signatar">{(a.signatarer as string) || profile.styre.styreleder.navn}</PH>, styrets leder</Text>
        </View>
      </View>
    </>
  );
}

// ---------- Dokumenttype: GF forenklet ----------

function GfForenklet({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const a = doc.answers;
  let sakstall = 7;
  return (
    <>
      <CompanyHeader profile={profile} tittel="Protokoll fra ordinær generalforsamling" />
      <Text style={styles.paragraph}>
        Generalforsamlingen ble holdt etter aksjelovens forenklede regler i § 5-7.
      </Text>
      <MoteInfo profile={profile} />

      <Text style={styles.section}>Aksjeeiere og aksjer representert</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Aksjonær</Text>
        <Text style={styles.tableCellSmall}>Aksjer</Text>
        <Text style={styles.tableCell}>Representant / fullmektig</Text>
      </View>
      {profile.aksjonaerer.length === 0 ? (
        <Text style={styles.placeholder}>[Legg til aksjonærer i selskapsprofilen]</Text>
      ) : (
        profile.aksjonaerer.map((k, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{k.navn || "—"}</Text>
            <Text style={styles.tableCellSmall}>{k.antall_aksjer || 0}</Text>
            <Text style={styles.tableCell}>{k.representant_fullmektig || k.navn || "—"}</Text>
          </View>
        ))
      )}

      <Text style={styles.section}>1. Godkjenning av behandlingsform og dagsorden</Text>
      <Text style={styles.paragraph}>
        Ingen aksjeeiere motsatte seg behandlingsformen forenklet generalforsamling etter aksjeloven § 5-7.
        Dagsorden ble godkjent, og <PH hint="signatar">{a.signatar as string}</PH> ble valgt til å signere protokollen.
      </Text>

      <Text style={styles.section}>2. Godkjennelse av årsregnskap</Text>
      <Text style={styles.paragraph}>
        Selskapets årsregnskap for <PH hint="år">{profile.regnskap.arstall}</PH> ble gjennomgått.
        Det fremlagte resultatregnskap, balanse og noter ble godkjent som selskapets offisielle regnskap for året.
      </Text>

      <Text style={styles.section}>3. Disponering av årsresultat</Text>
      <Text style={styles.paragraph}>
        {(a.disponering_vedtak as string) || `Årets resultat på ${nokFormat(profile.regnskap.arets_resultat)} disponeres som følger: utbytte ${nokFormat(profile.regnskap.utbytte)}, overføring til annen egenkapital ${nokFormat(profile.regnskap.overforing_annen_egenkapital)}.`}
      </Text>

      <Text style={styles.section}>4. Godtgjørelse til styrets medlemmer</Text>
      <Text style={styles.paragraph}>
        {a.godtgjorelse_styret_bool
          ? (a.godtgjorelse_styret_vedtak as string) || "Godtgjørelse til styret ble godkjent i henhold til fremlagt forslag."
          : "Det ble ikke godkjent godtgjørelse til styrets medlemmer for perioden."}
      </Text>

      <Text style={styles.section}>5. Godtgjørelse til revisor</Text>
      <Text style={styles.paragraph}>
        {a.godtgjorelse_revisor_bool
          ? "Godtgjørelse til revisor for utført arbeid ble godkjent i henhold til fremlagt fakturagrunnlag."
          : "Ingen sak vedrørende godtgjørelse til revisor ble behandlet."}
      </Text>

      <Text style={styles.section}>6. Valg av styre</Text>
      <Text style={styles.paragraph}>
        {a.valg_styret === "gjenvalg"
          ? "Eksisterende styre ble gjenvalgt for ny funksjonsperiode."
          : a.valg_styret === "nytt"
          ? "Følgende ble valgt til nye styremedlemmer: " +
            (Array.isArray(a.nye_styremedlemmer) ? "" : (a.nye_styremedlemmer as string) || "—")
          : "Det ble ikke gjennomført valg av styre i dette møtet."}
      </Text>

      {doc.sub_sections.map((s, i) => (
        <SakModulBlock key={i} valg={s} sakstall={sakstall++} />
      ))}

      <View style={{ marginTop: 30 }}>
        <Text>Sted: ______________________     Dato: <PH hint="dato">{profile.moteinfo.dato}</PH></Text>
        <View style={styles.signatureLine}>
          <Text><PH hint="signatar">{a.signatar as string}</PH></Text>
          {a.signatur_metode === "elektronisk" ? <Text style={{ fontSize: 8, color: "#6b7280" }}>(Signert elektronisk)</Text> : null}
        </View>
      </View>
    </>
  );
}

// ---------- Dokumenttype: GF alminnelige regler ----------

function GfAlminnelig({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const a = doc.answers;
  let sakstall = 7;
  return (
    <>
      <CompanyHeader profile={profile} tittel="Protokoll fra ordinær generalforsamling" />
      <Text style={styles.paragraph}>
        Generalforsamlingen ble holdt etter aksjelovens alminnelige regler, jf. §§ 5-8 og 5-9.
      </Text>
      <MoteInfo profile={profile} />

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Møteleder:</Text>
        <Text style={styles.metaValue}><PH hint="navn">{a.moteleder as string}</PH></Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Protokollfører:</Text>
        <Text style={styles.metaValue}><PH hint="navn">{a.protokollforer as string}</PH></Text>
      </View>
      <Text style={styles.paragraph}>
        Møteleder konstaterte at innkallingen var{" "}
        {a.innkallingsfrist_ok ? "utsendt innen lovbestemt frist" : "sendt, men uten at fristen ble overholdt — samtlige aksjeeiere samtykket til behandlingen"}
        , og at generalforsamlingen var lovlig satt.
      </Text>

      <Text style={styles.section}>Aksjeeiere og aksjer representert</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Aksjonær</Text>
        <Text style={styles.tableCellSmall}>Aksjer</Text>
        <Text style={styles.tableCell}>Representant</Text>
      </View>
      {profile.aksjonaerer.map((k, i) => (
        <View key={i} style={styles.tableRow}>
          <Text style={styles.tableCell}>{k.navn}</Text>
          <Text style={styles.tableCellSmall}>{k.antall_aksjer}</Text>
          <Text style={styles.tableCell}>{k.representant_fullmektig || k.navn}</Text>
        </View>
      ))}

      <Text style={styles.section}>1. Godkjenning av innkalling og dagsorden</Text>
      <Text style={styles.paragraph}>Innkalling og dagsorden ble godkjent.</Text>

      <Text style={styles.section}>2. Godkjennelse av årsregnskap{profile.regnskap.har_arsberetning ? " og årsberetning" : ""}</Text>
      <Text style={styles.paragraph}>
        Årsregnskapet for {profile.regnskap.arstall} ble godkjent{profile.regnskap.har_arsberetning ? " sammen med styrets årsberetning" : ""}.
      </Text>

      <Text style={styles.section}>3. Disponering av årsresultat</Text>
      <Text style={styles.paragraph}>
        {(a.disponering_vedtak as string) || `Årets resultat på ${nokFormat(profile.regnskap.arets_resultat)} ble disponert som følger: utbytte ${nokFormat(profile.regnskap.utbytte)}, overføring til annen egenkapital ${nokFormat(profile.regnskap.overforing_annen_egenkapital)}.`}
      </Text>

      <Text style={styles.section}>4. Godtgjørelse til styret</Text>
      <Text style={styles.paragraph}>
        {a.godtgjorelse_styret_bool
          ? (a.godtgjorelse_styret_vedtak as string) || "Godtgjørelse til styret ble godkjent."
          : "Det ble ikke godkjent godtgjørelse til styret."}
      </Text>

      <Text style={styles.section}>5. Godtgjørelse til revisor</Text>
      <Text style={styles.paragraph}>
        {a.godtgjorelse_revisor_bool ? "Godtgjørelse til revisor godkjennes etter regning." : "Ingen sak behandlet."}
      </Text>

      <Text style={styles.section}>6. Valg av styre</Text>
      <Text style={styles.paragraph}>
        {a.valg_styret === "gjenvalg"
          ? "Eksisterende styre ble gjenvalgt."
          : a.valg_styret === "nytt"
          ? "Nytt styre ble valgt: " + ((a.nye_styremedlemmer as string) || "—")
          : "Ingen valg gjennomført."}
      </Text>

      {doc.sub_sections.map((s, i) => (
        <SakModulBlock key={i} valg={s} sakstall={sakstall++} />
      ))}

      <View style={{ marginTop: 30 }}>
        <Text>Sted: ______________________     Dato: {profile.moteinfo.dato}</Text>
        <View style={styles.signatureLine}>
          <Text><PH hint="møteleder">{a.moteleder as string}</PH>, møteleder</Text>
        </View>
        <View style={styles.signatureLine}>
          <Text><PH hint="medunderskriver">{a.medunderskriver as string}</PH>, medunderskriver</Text>
        </View>
      </View>
    </>
  );
}

// ---------- Dokumenttype: Innkalling GF ----------

function InnkallingGf({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const a = doc.answers;
  return (
    <>
      <CompanyHeader profile={profile} tittel="Innkalling til ordinær generalforsamling" />
      <MoteInfo profile={profile} />

      <Text style={styles.paragraph}>
        Det innkalles herved til ordinær generalforsamling i <PH hint="selskap">{profile.selskap.navn}</PH> (org.nr.{" "}
        <PH hint="orgnr">{profile.selskap.orgnummer}</PH>).
      </Text>

      <Text style={styles.section}>Saksliste</Text>
      <Text style={styles.paragraph}>1. Åpning og valg av møteleder / protokollfører</Text>
      <Text style={styles.paragraph}>2. Godkjenning av innkalling og dagsorden</Text>
      <Text style={styles.paragraph}>3. Godkjennelse av årsregnskap{profile.regnskap.har_arsberetning ? " og årsberetning" : ""} for {profile.regnskap.arstall}</Text>
      <Text style={styles.paragraph}>4. Disponering av årsresultat</Text>
      <Text style={styles.paragraph}>5. Godtgjørelse til styret og revisor</Text>
      {doc.sub_sections.map((s, i) => {
        const def = sakModuler.find(sm => sm.id === s.id);
        const title = s.id === "fritekst_sak" && s.data.overskrift ? (s.data.overskrift as string) : def?.tittel;
        return <Text key={i} style={styles.paragraph}>{6 + i}. {title}</Text>;
      })}

      {a.paameldingsfrist ? (
        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          Frist for påmelding og fullmakt: <PH hint="dato">{a.paameldingsfrist as string}</PH>. Fullmakt sendes til styrets leder.
        </Text>
      ) : null}

      <Text style={[styles.paragraph, { marginTop: 10 }]}>
        Ved spørsmål kontakt styrets leder på <PH hint="e-post">{profile.styre.styreleder.epost}</PH>
        {profile.styre.styreleder.telefon ? ` eller tlf. ${profile.styre.styreleder.telefon}` : ""}.
      </Text>

      <View style={{ marginTop: 40 }}>
        <Text>Sted: <PH hint="sted">{a.signatur_sted as string}</PH>     Dato: <PH hint="dato">{a.signatur_dato as string}</PH></Text>
        <View style={styles.signatureLine}>
          <Text>{profile.styre.styreleder.navn || "________________________"}, styrets leder</Text>
        </View>
      </View>
    </>
  );
}

// ---------- Hoveddokument ----------

export function ProtokollDocument({ profile, doc }: { profile: CompanyProfile; doc: DocumentState }) {
  const content = (() => {
    switch (doc.type) {
      case "styremoteprotokoll": return <StyremoteProtokoll profile={profile} doc={doc} />;
      case "innkalling_styremote": return <InnkallingStyremote profile={profile} doc={doc} />;
      case "gf_forenklet": return <GfForenklet profile={profile} doc={doc} />;
      case "gf_alminnelige_regler": return <GfAlminnelig profile={profile} doc={doc} />;
      case "innkalling_gf": return <InnkallingGf profile={profile} doc={doc} />;
    }
  })();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {content}
        <Footer />
      </Page>
    </Document>
  );
}
