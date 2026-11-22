"use client";
import CrudPage, { COUNTRY_OPTIONS } from "../../components/CrudPage";

export default function Events() {
  return (
    <CrudPage
      table="events"
      title="Agenda 📅"
      intro="Events voor de Spicy agenda in de app. Spelers zien alleen toekomstige events in hun land/regio (leeg = overal). Neem events alleen over met toestemming van de organisator of bronwebsite."
      order={["starts_at", true]}
      defaults={{ active: true, country: "NL" }}
      fields={[
        { name: "title", label: "Titel", required: true },
        { name: "starts_at", label: "Datum en tijd", type: "datetime", required: true },
        { name: "venue", label: "Locatie / club" },
        { name: "city", label: "Stad" },
        { name: "country", label: "Land", type: "select", options: COUNTRY_OPTIONS },
        { name: "region", label: "Regio / provincie", help: "Bijv. Noord-Holland of Antwerpen. Leeg = heel het land." },
        { name: "category", label: "Soort", type: "select", options: [["", "-"], ["Party", "Party"], ["Club", "Club"], ["Sauna", "Sauna"], ["Festival", "Festival"], ["Workshop", "Workshop"]] },
        { name: "url", label: "Link (tickets/info)", type: "url" },
        { name: "description", label: "Omschrijving", type: "textarea", wide: true, rows: 3 },
        { name: "featured", label: "Uitgelicht (betaalde vermelding)", type: "checkbox" },
        { name: "active", label: "Zichtbaar in app", type: "checkbox" },
      ]}
      summary={(r) => (
        <>
          <div className="font-semibold">{r.title} {r.featured && <span className="badge badge-primary badge-sm ml-1">Uitgelicht</span>}</div>
          <div className="text-sm opacity-70">{new Date(r.starts_at).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })} · {[r.venue, r.city, r.country, r.region].filter(Boolean).join(" · ")}</div>
        </>
      )}
    />
  );
}
