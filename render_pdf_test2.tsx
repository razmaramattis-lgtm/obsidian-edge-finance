import { Document, Page, Text, View, StyleSheet, renderToFile } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 12 },
  footer: { position: "absolute", bottom: 24, left: 50, right: 50, fontSize: 8, color: "#666" },
});

const TestDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>Hello</Text>
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
    </Page>
  </Document>
);

renderToFile(<TestDoc />, "/tmp/browser/protokoll/out_test.pdf")
  .then(() => console.log("PDF skrevet"))
  .catch((err) => { console.error(err); process.exit(1); });
