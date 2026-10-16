/**
 * Lokale landingssider under /regnskapsforer-i/:slug.
 *
 * Bare kjerneområdene har egen side. Tekstene er godkjent i dokumentet
 * «Avargo.no – tekstutkast: lokale sider og bytte regnskapsfører» (okt. 2026).
 * Adresser for byer som ikke står her, sendes videre til oversikten.
 */

export type CityFaq = { q: string; a: string };

export type City = {
  slug: string;
  name: string;
  /** Preposisjon foran stedsnavnet: «i Oslo», «på Jessheim». */
  prep: "i" | "på";
  region: string;
  county: string;
  /** Ingress øverst på siden. */
  intro: string;
  /** Avsnittet «Næringslivet i …». */
  business: string;
  /** Punktene under «Hvem vi hjelper …». */
  helps: string[];
  /** Valgfri linje under punktene. */
  helpsNote?: string;
  /** Avsnittet «Møter og samarbeid». */
  meeting: string;
  /** To lokale spørsmål og svar. */
  localFaq: CityFaq[];
  /** Nabobyer blant kjerneområdene (slugs). */
  nearby: string[];
};

const HELFO = "Helse- og behandlerbedrifter med eller uten HELFO refusjon";
const FAGFOLK = "Fagfolk innen ulike bransjer som eiendom, bygg, håndverk";

export const CITIES: City[] = [
  {
    slug: "oslo",
    name: "Oslo",
    prep: "i",
    region: "Oslo",
    county: "Oslo",
    intro:
      "Oslo har flest små bedrifter i landet, og mange av dem er rådgivere, klinikker og salonger med én til ti ansatte. De trenger en regnskapsfører som svarer raskt og forstår hverdagen deres. Avargo fører regnskap for små og mellomstore bedrifter i hele Oslo, til fast månedspris.",
    business:
      "Oslo er landets største marked for kunnskaps- og tjenestebedrifter. Fra sentrum og Majorstuen til Bjørvika, Nydalen og Skøyen finner du konsulentselskaper, IT-rådgivere, arkitekter, helseklinikker, tannleger, fysioterapeuter og et stort utvalg av andre bransjer. Mange er enkeltpersonforetak eller små AS med eier som jobber i driften selv, og som har lite tid til bilag og frister.",
    helps: [
      "Konsulenter og rådgivere med eget AS",
      "Bedrifter som leverer helsetjenester, med og uten HELFO avtale",
      "Frisører, hudpleie- og skjønnhetssalonger",
      "E-handel/netthandelbedrifter",
      "Holdingselskaper for eiere av slike bedrifter",
    ],
    helpsNote: "Driver du et AS med en nisje? Vi hjelper gjerne deg også.",
    meeting:
      "Vi møter Oslo-kunder i Oslo sentrum eller på Lysaker etter avtale, og på video når det passer bedre. Bilag, lønn og rapporter håndteres i regnskapssystemet ditt, så du slipper å levere permer.",
    localFaq: [
      {
        q: "Jeg har et konsulent-AS i Oslo. Hva trenger jeg hjelp til?",
        a: "Typisk løpende bokføring, MVA-meldinger, lønn til deg selv, årsregnskap og skattemelding. Vi hjelper deg også med å vurdere fordelingen mellom lønn og utbytte, og om et holdingselskap lønner seg.",
      },
      {
        q: "Driver dere med helseklinikker i Oslo?",
        a: "Ja. Vi fører regnskap for klinikker og behandlere, og kjenner til hvordan helsetjenester behandles i MVA-sammenheng og hvordan oppgjør fra behandlere og leietakere bør føres.",
      },
    ],
    nearby: ["baerum", "lillestrom", "asker"],
  },
  {
    slug: "lillestrom",
    name: "Lillestrøm",
    prep: "i",
    region: "Romerike",
    county: "Akershus",
    intro:
      "Avargo har kontor i Lillestrøm, og her er vi lokale. Vi fører regnskap for små og mellomstore bedrifter i hele Lillestrøm kommune, fra Strømmen og Skedsmokorset til Fetsund og Sørumsand, til fast månedspris.",
    business:
      "Lillestrøm er en av de raskest voksende kommunene på Østlandet, med kort vei til Oslo og Gardermoen. Rundt sentrum, Strømmen og Kjeller vokser det fram nye boligområder, og med dem følger behovet for lokale tjenester innen helse og velvære, konsulent og rådgivning, handel og e-handel. Mange konsulenter og rådgivere bor i kommunen og driver eget selskap herfra, og nærheten til Ahus i Lørenskog gir et sterkt miljø av helsepersonell som også driver privat praksis.",
    helps: [
      "Behandlere og helsepersonell med eller uten HELFO refusjon",
      "Frisører, hudpleie- og skjønnhetssalonger",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi møter deg gjerne i Lillestrøm. Det meste av samarbeidet skjer likevel digitalt, i regnskapssystemet og på video, så du får svar uten å måtte sette av tid til møter.",
    localFaq: [
      {
        q: "Har dere kontor i Lillestrøm?",
        a: "Ja. Avargo holder til i Lillestrøm, og vi møter kunder her etter avtale. Vi har også møtelokaler på Lysaker og i Oslo sentrum.",
      },
      {
        q: "Jeg er fysioterapeut med egen praksis. Trenger jeg regnskapsfører?",
        a: "Det er ikke påkrevd, men de fleste sparer tid og unngår feil. Vi fører bilag, holder orden på MVA-reglene for helsetjenester, ordner lønn eller uttak til deg selv og leverer årsregnskap og skattemelding.",
      },
    ],
    nearby: ["oslo", "jessheim", "arnes"],
  },
  {
    slug: "jessheim",
    name: "Jessheim",
    prep: "på",
    region: "Romerike",
    county: "Akershus",
    intro:
      "Jessheim har vokst raskt de siste årene, og mange nye bedrifter har etablert seg rundt sentrum og næringsområdene i Ullensaker. Avargo fører regnskap for små og mellomstore bedrifter på Jessheim og resten av øvre Romerike, til fast månedspris.",
    business:
      "Nærheten til Oslo lufthavn Gardermoen preger Ullensaker, med logistikk, transport og reiseliv. Samtidig har den store befolkningsveksten gitt et voksende marked for lokale tjenester: helsesentre, tannleger, fysioterapeuter, frisører og skjønnhetssalonger rundt Jessheim sentrum. Mange som jobber i Oslo eller på Gardermoen driver også konsulentselskap ved siden av eller på heltid fra hjemmekontor her.",
    helps: [
      HELFO,
      "Frisører, hudpleie og skjønnhet",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer i Ullensaker",
    ],
    meeting:
      "Vi samarbeider digitalt med de fleste kunder på Jessheim, og møtes i Lillestrøm eller på video når det trengs. Fra Lillestrøm er det kort vei opp til Jessheim om et møte på stedet er bedre.",
    localFaq: [
      {
        q: "Jeg har nettopp startet en salong på Jessheim. Når bør jeg skaffe regnskapsfører?",
        a: "Helst fra start. Da blir kassasystem, MVA-registrering og bilagsflyt satt opp riktig fra dag én, og du slipper å rydde i etterkant.",
      },
      {
        q: "Tar dere enkeltpersonforetak, eller bare AS?",
        a: "Begge deler. Mange starter som enkeltpersonforetak og går over til AS når driften vokser. Vi kan hjelpe deg med å vurdere når det lønner seg.",
      },
    ],
    nearby: ["lillestrom", "eidsvoll", "arnes"],
  },
  {
    slug: "eidsvoll",
    name: "Eidsvoll",
    prep: "i",
    region: "Romerike",
    county: "Akershus",
    intro:
      "På Råholt, Eidsvoll Verk og Sundet finnes det mange små bedrifter som drives av eieren selv. Avargo fører regnskap for små og mellomstore bedrifter i Eidsvoll, til fast månedspris og med en fast kontaktperson.",
    business:
      "Eidsvoll ligger mellom Gardermoen og Mjøsa, med jernbane og E6 som gjør det enkelt å pendle både nord og sør. Kommunen har et næringsliv preget av små bedrifter: lokale helsetilbud, frisører og skjønnhetssalonger, treningssentre, håndverkere og konsulenter som jobber fra hjemmekontor. Råholt har vokst til et handels- og servicesentrum, og Eidsvollsbygningen trekker besøkende til området hele året.",
    helps: [
      HELFO,
      "Frisører, hudpleie og skjønnhet",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi samarbeider digitalt med kunder i Eidsvoll og møtes på video eller i Lillestrøm etter avtale. Du får en fast kontaktperson som kjenner bedriften din.",
    localFaq: [
      {
        q: "Er det lurt å bruke en regnskapsfører som ikke er i Eidsvoll?",
        a: "For de fleste små bedrifter spiller avstand liten rolle, fordi bilag og dokumenter ligger digitalt. Det viktigste er at du får svar når du trenger det. Vil du møtes, avtaler vi det.",
      },
      {
        q: "Jeg driver enkeltpersonforetak ved siden av jobben. Trenger jeg regnskapsfører?",
        a: "Ikke nødvendigvis, men mange velger det for å slippe feil i næringsspesifikasjonen og MVA. Vi kan ta bare årsoppgjøret, eller hele regnskapet, etter hva du trenger.",
      },
    ],
    nearby: ["jessheim", "arnes", "lillestrom"],
  },
  {
    slug: "arnes",
    name: "Årnes",
    prep: "på",
    region: "Romerike",
    county: "Akershus",
    intro:
      "Årnes er sentrum i Nes kommune, og her driver mange eiere sin egen bedrift med kunder i hele Romerike. Avargo fører regnskap for små og mellomstore bedrifter på Årnes og i resten av Nes, til fast månedspris.",
    business:
      "Nes har mye landbruk, men Årnes sentrum har også et voksende tilbud av lokale tjenester: helse og behandling, frisører og skjønnhet, trening og andre servicebedrifter for innbyggerne i kommunen. Med tog langs Kongsvingerbanen og kort vei til Gardermoen bor det også mange her som driver konsulentvirksomhet med kunder i Oslo-området.",
    helps: [
      HELFO,
      "Landbruksnæring og nærliggende virkeområder",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi samarbeider digitalt og møtes i Lillestrøm eller på video etter avtale. Du får en fast kontaktperson og svar på spørsmålene dine uten å måtte reise.",
    localFaq: [
      {
        q: "Jeg er fra Årnes og har kunder i Oslo. Spiller det noen rolle hvor regnskapsføreren holder til?",
        a: "Nei. Regnskapet føres likt uansett hvor kundene dine er. Det som betyr noe, er at regnskapsføreren kjenner bransjen din og svarer når du trenger det.",
      },
      {
        q: "Hvordan leverer jeg bilag?",
        a: "Du tar bilde av kvitteringen med mobilen eller videresender fakturaen på e-post til regnskapssystemet. Vi gjør resten. Du trenger ikke levere noe fysisk.",
      },
    ],
    nearby: ["jessheim", "kongsvinger", "lillestrom"],
  },
  {
    slug: "kongsvinger",
    name: "Kongsvinger",
    prep: "i",
    region: "Glåmdalen",
    county: "Innlandet",
    intro:
      "Kongsvinger er regionsenteret i Glåmdalen, og mange bedrifter her betjener hele regionen. Avargo fører regnskap for små og mellomstore bedrifter i Kongsvinger og omegn, til fast månedspris og med en fast kontaktperson.",
    business:
      "Kongsvinger har sykehus, videregående skole og offentlige arbeidsplasser som trekker folk fra hele Glåmdalen, og et sentrum med handel og service. Det gir et marked for private helsetilbud, tannleger, fysioterapeuter, frisører, hudpleie og treningssentre. Nærheten til svenskegrensen og togforbindelsen til Lillestrøm og Oslo gjør også byen attraktiv for konsulenter som jobber fra hjemmekontor.",
    helps: [
      HELFO,
      "Landbruksnæring og nærliggende virkeområder",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer i Glåmdalen",
    ],
    meeting:
      "Vi har allerede kunder i Kongsvinger-regionen. Samarbeidet skjer stort sett digitalt, og vi møtes på video eller i Lillestrøm, en kort togtur unna, når det trengs. Det er heller ikke noe i veien for å ta et fysisk møte i Kongsvinger.",
    localFaq: [
      {
        q: "Har dere kunder i Kongsvinger-regionen?",
        a: "Ja. Vi fører regnskap for flere bedrifter i Kongsvinger og omegn, og kjenner det lokale næringslivet.",
      },
      {
        q: "Jeg har kunder eller leverandører i Sverige. Kan dere håndtere det?",
        a: "Ja. Vi fører kjøp og salg fra utland iht. gjeldende regelverk, slik at du er trygg på at regnskapet blir riktig.",
      },
    ],
    nearby: ["arnes", "lillestrom"],
  },
  {
    slug: "asker",
    name: "Asker",
    prep: "i",
    region: "Asker",
    county: "Akershus",
    intro:
      "Asker har mange små kunnskapsbedrifter og lokale tjenestetilbud, fra Asker sentrum og Billingstad til Slemmestad og Heggedal. Avargo fører regnskap for små og mellomstore bedrifter i hele Asker, til fast månedspris.",
    business:
      "Etter sammenslåingen med Røyken og Hurum dekker Asker kommune et stort område med både tett by og spredt bebyggelse. Mange som bor her driver konsulent- og rådgivningsselskaper med kunder i Oslo og Bærum. I sentrumsområdene er det et rikt tilbud av private helsetjenester, tannleger, fysioterapeuter, frisører, hudpleie og treningssentre, og et voksende marked for velvære og behandling.",
    helps: [
      HELFO,
      "Frisører, hudpleie og skjønnhet",
      "Konsulenter og rådgivere med eget AS",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi møter kunder fra Asker på Lysaker etter avtale, eller på video. Det meste av samarbeidet skjer digitalt i regnskapssystemet ditt.",
    localFaq: [
      {
        q: "Jeg har et driftsselskap og et holdingselskap. Kan dere føre begge?",
        a: "Ja. Vi fører regnskap for begge selskapene og hjelper deg med utbytte, konsernbidrag og hva som lønner seg å ha i hvilket selskap.",
      },
      {
        q: "Hvor møtes vi hvis jeg bor i Asker?",
        a: "Vi kan møtes på Lysaker eller avtale møte ute hos deg som kunde dersom det er ønskelig. De fleste møter tar vi likevel på video.",
      },
    ],
    nearby: ["baerum", "drammen", "oslo"],
  },
  {
    slug: "baerum",
    name: "Bærum",
    prep: "i",
    region: "Bærum",
    county: "Akershus",
    intro:
      "Bærum har et av landets tetteste miljøer av små rådgivnings- og kunnskapsbedrifter. Avargo har møtelokale på Lysaker og fører regnskap for små og mellomstore bedrifter i hele Bærum, fra Sandvika og Bekkestua til Stabekk og Fornebu, til fast månedspris.",
    business:
      "Lysaker og Fornebu er blant de største kontorområdene i landet, med store selskaper innen teknologi og energi. Rundt dem har det vokst fram et stort antall små konsulent- og rådgivningsselskaper, ofte med eieren som eneste ansatt og et holdingselskap ved siden av. I Sandvika, på Bekkestua og andre lokalsentre er det også mange private klinikker, tannleger, fysioterapeuter, frisører og velværetilbud.",
    helps: [
      "Konsulenter og rådgivere med eget AS og holdingselskap",
      HELFO,
      "Frisører, hudpleie og skjønnhet",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi møter kunder på Lysaker etter avtale, og på video når det passer bedre. Bilag, lønn og rapporter håndteres digitalt i regnskapssystemet ditt.",
    localFaq: [
      {
        q: "Jeg er innleid konsulent gjennom eget AS. Hva bør jeg tenke på?",
        a: "Du bør ha orden på lønn eller utbytte til deg selv, MVA på fakturaene og at selskapet setter av til skatt. Vi fører regnskapet løpende og gir deg råd om hvordan du tar ut penger mest gunstig.",
      },
      {
        q: "Har dere kontor i Bærum?",
        a: "Vi har møtelokale på Lysaker, der vi møter kunder ved behov. Hovedkontoret ligger i Lillestrøm.",
      },
    ],
    nearby: ["oslo", "asker", "drammen"],
  },
  {
    slug: "drammen",
    name: "Drammen",
    prep: "i",
    region: "Drammensregionen",
    county: "Buskerud",
    intro:
      "Drammen er regionsenteret i Buskerud, med et levende sentrum på begge sider av elva. Avargo fører regnskap for små og mellomstore bedrifter i Drammen og omegn, til fast månedspris og med en fast kontaktperson.",
    business:
      "Drammen har sykehus, høgskole og et handels- og servicesentrum på Bragernes og Strømsø som trekker kunder fra hele regionen. Det gir et stort marked for private helsetjenester, tannleger, fysioterapeuter, andre tjenester og samt varehandel. Med kort togreise til Oslo bor det også mange konsulenter og rådgivere i Drammen som driver eget selskap.",
    helps: [
      "Konsulenter og rådgivere med eget AS og holdingselskap",
      HELFO,
      "Frisører, hudpleie og skjønnhet",
      FAGFOLK,
      "Andre lokale bedrifter som yter tjenester og varer",
    ],
    meeting:
      "Vi samarbeider digitalt med kunder i Drammen og møtes på video eller på Lysaker etter avtale.",
    localFaq: [
      {
        q: "Jeg skal åpne klinikk i Drammen. Hva må jeg tenke på regnskapsmessig?",
        a: "Valg av selskapsform, om tjenestene er MVA-pliktige eller unntatt, kassasystem og hvordan du skiller egne og selskapets penger. Vi hjelper deg med oppstarten, slik at regnskapet er satt opp riktig fra første dag.",
      },
      {
        q: "Kan jeg ha regnskapsfører i Lillestrøm når bedriften er i Drammen?",
        a: "Ja. Bilag, rapporter og møter håndteres digitalt. Det viktigste er en fast kontaktperson som svarer raskt.",
      },
    ],
    nearby: ["asker", "baerum", "oslo"],
  },
];

/** Tre spørsmål som står på alle bysidene. */
export const sharedCityFaq = (city: City): CityFaq[] => [
  {
    q: "Må jeg møte opp på kontoret?",
    a: "Nei. Det meste av samarbeidet skjer digitalt, med bilag i regnskapssystemet og møter på video. Vil du heller møtes fysisk, avtaler vi det i Lillestrøm, på Lysaker eller i Oslo.",
  },
  {
    q: `Hva koster en regnskapsfører for et lite AS ${city.prep} ${city.name}?`,
    a: "Vi har fast månedspris fra 1 950 kr eks. mva. Prisen avhenger av omsetning, antall bilag og om du har ansatte, og den er den samme uansett hvor i området du holder til. Kalkulatoren gir deg et estimat på et par minutter.",
  },
  {
    q: "Kan dere ta over fra regnskapsføreren jeg har i dag?",
    a: "Ja. Vi tar kontakt med nåværende regnskapsfører og ordner overleveringen. Les mer på siden om å bytte regnskapsfører.",
  },
];

export const getCityBySlug = (slug?: string): City | undefined =>
  CITIES.find((c) => c.slug === slug);
