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

const doc = emptyDocument("styremoteprotokoll");
doc.answers.signatur_dato = "2026-01-15";

renderToFile(<ProtokollDocument profile={profile} doc={doc} />, "/tmp/browser/protokoll/out3.pdf")
  .then(() => console.log("PDF skrevet"))
  .catch((err) => { console.error(err); process.exit(1); });
