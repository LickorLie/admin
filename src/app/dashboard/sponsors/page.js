"use client";
import CrudPage, { COUNTRY_OPTIONS } from "../../components/CrudPage";

export default function Sponsors() {
  return (
    <CrudPage
      table="sponsors"
      title="Deals & advertenties 🎁"
      intro="Deals verschijnen in de app onder Deals, alleen voor spelers in het gekozen land/regio (leeg = overal). Vink 'Volledig scherm' aan voor de advertentie van 10 seconden bij het openen."
      order={["created_at", false]}
      defaults={{ is_fullscreen: false, label: "affiliate", country: "NL" }}
      fields={[
        { name: "title", label: "Titel", required: true },
        { name: "discount", label: "Korting (bijv. 20% OFF)" },
        { name: "description", label: "Omschrijving", type: "textarea", wide: true, rows: 3 },
        { name: "link", label: "Link (AWIN of partner)", type: "url", required: true },
        { name: "image", label: "Afbeelding (URL)", type: "url" },
        { name: "country", label: "Land (leeg = overal)", type: "select", options: COUNTRY_OPTIONS },
        { name: "region", label: "Regio (leeg = heel het land)" },
        { name: "label", label: "Label", type: "select", options: [["affiliate", "Affiliate"], ["partner", "Partner"]] },
        { name: "is_fullscreen", label: "Volledig scherm (10 sec bij openen)", type: "checkbox" },
      ]}
      summary={(r) => (
        <div className="flex gap-3 items-center">
          {r.image && <img src={r.image} alt="" className="w-16 h-12 object-cover rounded" />}
          <div className="min-w-0">
            <div className="font-semibold">{r.title} {r.is_fullscreen && <span className="badge badge-sm badge-primary ml-1">Volledig scherm</span>} <span className="badge badge-sm ml-1">{r.label === "partner" ? "Partner" : "Affiliate"}</span></div>
            <div className="text-sm opacity-70 truncate">{r.discount} · {[r.country || "Overal", r.region].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
      )}
    />
  );
}
