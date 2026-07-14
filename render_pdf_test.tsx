import { pdf } from "@react-pdf/renderer";
import { ProtokollDocument } from "/dev-server/src/lib/protokoll/pdf";
import { emptyProfile, emptyDocument } from "/dev-server/src/lib/protokoll/types";

const profile = emptyProfile();
profile.selskap.navn = "Test AS";
profile.selskap.orgnummer = "123456789";
profile.moteinfo.dato = "2026-01-15";
profile.moteinfo.sted_eller_moteform = "Skien";
profile.styre.styremedlemmer = [{ navn: "Ola Nordmann", rolle: "styreleder", deltok: true, epost: "ola@test.no" }];
profile.styre.styreleder = { navn: "Ola Nordmann", rolle: "styreleder", epost: "ola@test.no" };

const doc = emptyDocument("styremoteprotokoll");
doc.answers.signatur_dato = "2026-01-15";

const instance = pdf(<ProtokollDocument profile={profile} doc={doc} />);
instance.toBuffer().then((buf) => {
  const fs = require("fs");
  fs.writeFileSync("/tmp/browser/protokoll/out.pdf", buf);
  console.log("PDF skrevet");
});
