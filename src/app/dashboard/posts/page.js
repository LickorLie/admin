"use client";
import CrudPage, { COUNTRY_OPTIONS } from "../../components/CrudPage";

export default function Posts() {
  return (
    <CrudPage
      table="posts"
      title="Blog 🧠"
      intro="Schrijf hier je artikelen. Een concept zie je alleen hier; zet de status op 'Gepubliceerd' om het in de app te tonen. Witregels in de tekst worden alinea's."
      order={["created_at", false]}
      defaults={{ status: "draft" }}
      beforeSave={(p, prev) => ({ ...p, published_at: p.status === "published" ? (prev.published_at || new Date().toISOString()) : prev.published_at || null })}
      fields={[
        { name: "title", label: "Titel", required: true, wide: true },
        { name: "excerpt", label: "Korte intro (1 zin)", wide: true },
        { name: "body", label: "Tekst", type: "textarea", wide: true, rows: 16 },
        { name: "image_url", label: "Afbeelding (URL)", type: "url" },
        { name: "country", label: "Land (leeg = iedereen)", type: "select", options: COUNTRY_OPTIONS },
        { name: "status", label: "Status", type: "select", options: [["draft", "Concept"], ["published", "Gepubliceerd"]] },
      ]}
      summary={(r) => (
        <>
          <div className="font-semibold">{r.title} <span className={`badge badge-sm ml-1 ${r.status === "published" ? "badge-success" : ""}`}>{r.status === "published" ? "Gepubliceerd" : "Concept"}</span></div>
          <div className="text-sm opacity-70 truncate">{r.excerpt || r.body?.slice(0, 120)}</div>
        </>
      )}
    />
  );
}
