import { Document, Page, Text, View, StyleSheet, renderToFile } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingLeft: 71,
    paddingRight: 56,
    fontSize: 10.5,
    lineHeight: 1.45,
  },
  footerRight: { position: "absolute", bottom: 24, right: 56, fontSize: 8, color: "#9CA3AF" },
});

const lotsOfContent = Array.from({ length: 50 }, (_, i) => <Text key={i}>Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>);

const TestDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.footerRight} fixed render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
      {lotsOfContent}
    </Page>
  </Document>
);

renderToFile(<TestDoc />, "/tmp/browser/protokoll/out_test3.pdf")
  .then(() => console.log("PDF skrevet"))
  .catch((err) => { console.error(err); process.exit(1); });
