"use client";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import Sidebar, { MobileNav } from "../../components/Sidebar";
import { useAdminGuard } from "../../components/CrudPage";

const LEVELS = ["Sweet", "Sexy", "Spicy", "WetnWild"];

export default function Submissions() {
  useAdminGuard();
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("pending");
  const [error, setError] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("card_submissions").select("*").eq("status", tab).order("created_at", { ascending: tab === "pending" });
    if (error) setError(error.message); else setRows(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const update = (id, patch) => setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const approve = async (r) => {
    setError("");
    const { error: e1 } = await supabase.from("questions").insert([{
      theme: r.theme, level: r.level, type: r.type, question: r.question,
      requirespartner: /\[partner\]/i.test(r.question), timer: r.type === "dare" ? 30 : 1,
    }]);
    if (e1) { setError(e1.message); return; }
    await supabase.from("card_submissions").update({ status: "approved", question: r.question, level: r.level, type: r.type }).eq("id", r.id);
    load();
  };
  const reject = async (r) => {
    await supabase.from("card_submissions").update({ status: "rejected" }).eq("id", r.id);
    load();
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <MobileNav />
        <h1 className="font-serif text-4xl font-medium mb-2">Ingestuurde kaarten ✍️</h1>
        <p className="opacity-70 mb-4 max-w-2xl">Kaarten van spelers. Pas eventueel de tekst, het niveau of het type aan en klik op <b>Goedkeuren</b>: dan komt de kaart direct in het spel (Spicy-editie). Niets komt in het spel zonder jouw goedkeuring.</p>
        <div role="tablist" className="tabs tabs-box mb-4 w-fit">
          {[["pending", "Te beoordelen"], ["approved", "Goedgekeurd"], ["rejected", "Afgewezen"]].map(([k, l]) => (
            <button key={k} role="tab" className={`tab ${tab === k ? "tab-active" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.id} className="card bg-base-100 border border-base-300 p-4 gap-3">
              {tab === "pending" ? (
                <>
                  <textarea className="textarea textarea-bordered w-full" rows={3} value={r.question} onChange={(e) => update(r.id, { question: e.target.value })} />
                  <div className="flex flex-wrap gap-2 items-center">
                    <select className="select select-bordered select-sm w-auto" value={r.type} onChange={(e) => update(r.id, { type: e.target.value })}>
                      <option value="truth">Truth</option><option value="dare">Dare</option>
                    </select>
                    <select className="select select-bordered select-sm w-auto" value={r.level} onChange={(e) => update(r.id, { level: e.target.value })}>
                      {LEVELS.map((l) => <option key={l} value={l}>{l === "WetnWild" ? "Wet & Wild" : l}</option>)}
                    </select>
                    <span className="text-xs opacity-60">{new Date(r.created_at).toLocaleString("nl-NL")}</span>
                    <div className="flex-1" />
                    <button className="btn btn-sm btn-ghost text-error" onClick={() => reject(r)}>Afwijzen</button>
                    <button className="btn btn-sm btn-primary" onClick={() => approve(r)}>Goedkeuren</button>
                  </div>
                </>
              ) : (
                <div><span className="badge badge-sm mr-2">{r.type} · {r.level}</span>{r.question}</div>
              )}
            </div>
          ))}
          {!rows.length && <p className="opacity-60 py-8 text-center">Niets te zien.</p>}
        </div>
      </main>
    </div>
  );
}
