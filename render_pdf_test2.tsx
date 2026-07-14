import { Document, Page, Text, View, StyleSheet, renderToFile, Fragment } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 12 },
  footerLeft: { position: "absolute", bottom: 24, left: 50, fontSize: 8, color: "#666" },
  footerRight: { position: "absolute", bottom: 24, right: 50, fontSize: 8, color: "#666" },
});

function Footer() {
  return (
    <>
      <Text style={styles.footerLeft} fixed>Protokoll- og generalforsamlingsgenerator er produsert av Avargo.</Text>
      <Text style={styles.footerRight} fixed render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
    </>
  );
}

const TestDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>Hello</Text>
      <Footer />
    </Page>
  </Document>
);

renderToFile(<TestDoc />, "/tmp/browser/protokoll/out_test.pdf")
  .then(() => console.log("PDF skrevet"))
  .catch((err) => { console.error(err); process.exit(1); });
