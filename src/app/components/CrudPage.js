"use client";

import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import Sidebar, { MobileNav } from "./Sidebar";

/*
  Algemene beheerpagina: lijst + toevoegen/bewerken/verwijderen.
  fields: [{ name, label, type: 'text'|'textarea'|'url'|'datetime'|'checkbox'|'select'|'number'|'list', options?, required?, help? }]
*/

export const COUNTRY_OPTIONS = [
  ["", "Overal"], ["NL", "Nederland"], ["BE", "België"], ["DE", "Duitsland"], ["GB", "Verenigd Koninkrijk"], ["FR", "Frankrijk"], ["ES", "Spanje"],
];

export function useAdminGuard() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = `${window.location.origin}/`;
    });
  }, []);
}

function toInput(field, value) {
  if (field.type === "datetime" && value) {
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  if (field.type === "list") return Array.isArray(value) ? value.join("\n") : "";
  return value ?? (field.type === "checkbox" ? false : "");
}

function fromInput(field, value) {
  if (field.type === "datetime") return value ? new Date(value).toISOString() : null;
  if (field.type === "number") return value === "" ? null : Number(value);
  if (field.type === "list") return String(value).split("\n").map((s) => s.trim()).filter(Boolean);
  if (field.type === "checkbox") return !!value;
  return value === "" ? null : value;
}

export function Field({ field, value, onChange }) {
  const v = toInput(field, value);
  const common = { name: field.name, required: field.required, className: "w-full" };
  let input;
  if (field.type === "textarea" || field.type === "list") {
    input = <textarea {...common} rows={field.rows || (field.type === "list" ? 4 : 6)} className="textarea textarea-bordered w-full" value={v} onChange={(e) => onChange(e.target.value)} />;
  } else if (field.type === "checkbox") {
    input = <input type="checkbox" className="toggle toggle-primary" checked={!!v} onChange={(e) => onChange(e.target.checked)} />;
  } else if (field.type === "select") {
    input = (
      <select {...common} className="select select-bordered w-full" value={v ?? ""} onChange={(e) => onChange(e.target.value)}>
        {field.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
      </select>
    );
  } else {
    const t = field.type === "datetime" ? "datetime-local" : field.type === "number" ? "number" : field.type === "url" ? "url" : "text";
    input = <input {...common} type={t} className="input input-bordered w-full" value={v} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <label className={`form-control w-full ${field.wide ? "md:col-span-2" : ""}`}>
      <span className="label-text font-medium mb-1 block">{field.label}{field.required && " *"}</span>
      {input}
      {field.help && <span className="text-xs opacity-60 mt-1 block">{field.help}</span>}
    </label>
  );
}

export default function CrudPage({ table, title, intro, fields, order = ["created_at", false], summary, defaults = {}, beforeSave }) {
  useAdminGuard();
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null); // object being edited (or new)
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from(table).select("*").order(order[0], { ascending: order[1] });
    if (error) setError(error.message); else setRows(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {};
    fields.forEach((f) => { payload[f.name] = fromInput(f, toInput(f, editing[f.name])); });
    const final = beforeSave ? beforeSave(payload, editing) : payload;
    const q = editing.id ? supabase.from(table).update(final).eq("id", editing.id) : supabase.from(table).insert([final]);
    const { error } = await q;
    if (error) { setError(error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (row) => {
    if (!window.confirm("Weet je zeker dat je dit wilt verwijderen? Dit kan niet ongedaan worden.")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) setError(error.message); else load();
  };

  const toggleActive = async (row, key = "active") => {
    await supabase.from(table).update({ [key]: !row[key] }).eq("id", row.id);
    load();
  };

  const filtered = rows.filter((r) => !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-base-200">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <MobileNav />
        <div className="flex flex-wrap justify-between items-end gap-3 mb-2">
          <h1 className="font-serif text-4xl font-medium">{title}</h1>
          <div className="flex gap-2">
            <input className="input input-bordered" placeholder="Zoeken…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={() => setEditing({ ...defaults })}>+ Nieuw</button>
          </div>
        </div>
        {intro && <p className="opacity-70 mb-6 max-w-2xl">{intro}</p>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {editing && (
          <form onSubmit={save} className="card bg-base-100 border border-base-300 p-5 mb-6">
            <h2 className="font-serif text-2xl mb-4">{editing.id ? "Bewerken" : "Nieuw"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <Field key={f.name} field={f} value={editing[f.name]} onChange={(v) => setEditing({ ...editing, [f.name]: v })} />
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button className="btn btn-primary" type="submit">Opslaan</button>
              <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>Annuleren</button>
            </div>
          </form>
        )}

        <div className="grid gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="card bg-base-100 border border-base-300 p-4 flex-row items-center gap-4">
              <div className="flex-1 min-w-0">{summary(r)}</div>
              {"active" in r && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="toggle toggle-sm toggle-primary" checked={!!r.active} onChange={() => toggleActive(r)} /> Zichtbaar
                </label>
              )}
              <button className="btn btn-sm" onClick={() => setEditing({ ...r })}>Bewerken</button>
              <button className="btn btn-sm btn-ghost text-error" onClick={() => remove(r)}>Verwijderen</button>
            </div>
          ))}
          {!filtered.length && <p className="opacity-60 py-8 text-center">Nog niets hier. Klik op “+ Nieuw”.</p>}
        </div>
      </main>
    </div>
  );
}
