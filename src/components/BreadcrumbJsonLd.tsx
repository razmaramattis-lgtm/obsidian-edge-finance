import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const BreadcrumbJsonLd = ({ items }: { items: BreadcrumbItem[] }) => {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `https://avargo.no${item.href}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(breadcrumbList)}</script>
    </Helmet>
  );
};

export default BreadcrumbJsonLd;
