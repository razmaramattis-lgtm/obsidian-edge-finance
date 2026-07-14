import { renderToFile } from "@react-pdf/renderer";
import { ProtokollDocument } from "./src/lib/protokoll/pdf";
import { emptyProfile, emptyDocument } from "./src/lib/protokoll/types";

const profile = emptyProfile();
profile.selskap.navn = "Test AS";
profile.selskap.orgnummer = "123456789";
profile.moteinfo.dato = "2026-01-15";
profile.moteinfo.sted_eller_moteform = "Skien";
profile.styre.styremedlemmer = [{ navn: "Ola Nordmann", rolle: "styreleder", deltok: true, epost: "ola@test.no" }];
profile.styre.styreleder = { navn: "Ola Nordmann", rolle: "styreleder", epost: "ola@test.no" };
profile.aksjonaerer = [
  { navn: "Aksjonær A", antall_aksjer: 50, representant_fullmektig: "" },
  { navn: "Aksjonær B", antall_aksjer: 50, representant_fullmektig: "" },
];

const doc = emptyDocument("gf_alminnelige_regler");
doc.answers.signatar = "Ola Nordmann";
doc.answers.moteleder = "Ola Nordmann";
doc.answers.protokollforer = "Kari Nordmann";
doc.answers.innkallingsfrist_ok = true;
doc.answers.godtgjorelse_styret_bool = false;
doc.answers.godtgjorelse_revisor_bool = false;
doc.answers.valg_styret = "gjenvalg";

renderToFile(<ProtokollDocument profile={profile} doc={doc} />, "/tmp/browser/protokoll/out2.pdf")
  .then(() => console.log("PDF skrevet"))
  .catch((err) => { console.error(err); process.exit(1); });
