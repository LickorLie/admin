"use client";
import CrudPage, { COUNTRY_OPTIONS } from "../../components/CrudPage";

export default function Places() {
  return (
    <CrudPage
      table="places"
      title="Clubs & plekken 📍"
      intro="Clubs, sauna's en hotels die in de app onder Social → Clubs staan. 'Partner' = betaalde vermelding, komt bovenaan."
      order={["name", true]}
      defaults={{ active: true, country: "NL" }}
      fields={[
        { name: "name", label: "Naam", required: true },
        { name: "category", label: "Soort", type: "select", options: [["", "-"], ["Club", "Club"], ["Sauna", "Sauna"], ["Hotel", "Hotel"], ["Bar", "Bar"], ["Other", "Anders"]] },
        { name: "city", label: "Stad" },
        { name: "country", label: "Land", type: "select", options: COUNTRY_OPTIONS },
        { name: "region", label: "Regio / provincie" },
        { name: "url", label: "Website", type: "url" },
        { name: "description", label: "Korte omschrijving (Engels)", type: "textarea", wide: true, rows: 3 },
        { name: "featured", label: "Partner (betaald, bovenaan)", type: "checkbox" },
        { name: "active", label: "Zichtbaar in app", type: "checkbox" },
      ]}
      summary={(r) => (
        <>
          <div className="font-semibold">{r.name} {r.featured && <span className="badge badge-primary badge-sm ml-1">Partner</span>}</div>
          <div className="text-sm opacity-70">{[r.category, r.city, r.country, r.region].filter(Boolean).join(" · ")}</div>
        </>
      )}
    />
  );
}
