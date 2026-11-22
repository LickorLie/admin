"use client";
import { useEffect, useState } from "react";
import CrudPage from "../../components/CrudPage";
import supabase from "../../utils/supabase";

function Results({ poll }) {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    supabase.rpc("poll_results", { p_poll: poll.id }).then(({ data }) => setCounts(data || []));
  }, [poll.id]);
  if (!counts) return null;
  const total = counts.reduce((a, c) => a + Number(c.votes), 0);
  return (
    <div className="text-sm opacity-70">
      {(poll.options || []).map((o, i) => {
        const n = Number(counts.find((c) => c.option_index === i)?.votes || 0);
        return <span key={i} className="mr-3">{o}: {n} ({total ? Math.round((n / total) * 100) : 0}%)</span>;
      })}
      · {total} stemmen
    </div>
  );
}

export default function Polls() {
  return (
    <CrudPage
      table="polls"
      title="Vraag van de week 🤭"
      intro="De app toont de nieuwste zichtbare poll. Zet een oude poll op onzichtbaar of plan een nieuwe met een startdatum."
      order={["starts_at", false]}
      defaults={{ active: true, options: ["", ""] }}
      fields={[
        { name: "question", label: "Vraag (Engels)", required: true, wide: true },
        { name: "options", label: "Antwoorden (één per regel, 2 tot 5)", type: "list", wide: true },
        { name: "starts_at", label: "Start", type: "datetime" },
        { name: "active", label: "Zichtbaar in app", type: "checkbox" },
      ]}
      beforeSave={(p) => ({ ...p, starts_at: p.starts_at || new Date().toISOString() })}
      summary={(r) => (
        <>
          <div className="font-semibold">{r.question}</div>
          <Results poll={r} />
        </>
      )}
    />
  );
}
