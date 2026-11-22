"use client";
import CrudPage, { COUNTRY_OPTIONS } from "../../components/CrudPage";

export default function Partners() {
  return (
    <CrudPage
      table="partners"
      title="Partners (AWIN) 🦄"
      intro="Plak hier je AWIN-deeplinks (of andere partnerlinks). Ze verschijnen onder Social → Partners met het label 'Affiliate', zoals de Reclamecode vraagt. Lager sorteernummer = hoger in de lijst."
      order={["sort", true]}
      defaults={{ active: true, label: "affiliate", sort: 0 }}
      fields={[
        { name: "name", label: "Naam", required: true },
        { name: "url", label: "AWIN-link", type: "url", required: true, help: "Begint meestal met https://www.awin1.com/cread.php?…" },
        { name: "description", label: "Korte omschrijving (Engels)", wide: true },
        { name: "image_url", label: "Logo/afbeelding (URL)", type: "url" },
        { name: "category", label: "Categorie", type: "select", options: [["", "-"], ["Dating", "Dating"], ["Community", "Community"], ["Shop", "Shop"], ["Travel", "Travel"], ["Wellness", "Wellness"]] },
        { name: "country", label: "Land (leeg = overal)", type: "select", options: COUNTRY_OPTIONS },
        { name: "region", label: "Regio (leeg = heel het land)" },
        { name: "label", label: "Label", type: "select", options: [["affiliate", "Affiliate"], ["partner", "Partner"]] },
        { name: "sort", label: "Sorteernummer", type: "number" },
        { name: "active", label: "Zichtbaar in app", type: "checkbox" },
      ]}
      summary={(r) => (
        <>
          <div className="font-semibold">{r.name} <span className="badge badge-sm ml-1">{r.label === "partner" ? "Partner" : "Affiliate"}</span></div>
          <div className="text-sm opacity-70 truncate">{[r.category, r.country, r.region].filter(Boolean).join(" · ")} · {r.url}</div>
        </>
      )}
    />
  );
}
