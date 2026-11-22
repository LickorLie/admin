"use client";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

/* Hier kom je via de link uit de mail. Kies een nieuw wachtwoord. */
export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (pw.length < 12) { setMsg("Kies minstens 12 tekens."); return; }
    if (pw !== pw2) { setMsg("De wachtwoorden zijn niet gelijk."); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setMsg("Opslaan mislukt: " + error.message);
    else window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <form onSubmit={save} className="w-full max-w-sm card bg-base-100 border border-base-300 p-6 gap-3">
        <h1 className="font-serif text-3xl font-semibold">Nieuw wachtwoord</h1>
        {!ready ? (
          <p className="opacity-70">Link wordt gecontroleerd… Werkt het niet? Vraag op de inlogpagina een nieuwe link aan.</p>
        ) : (
          <>
            <input className="input input-bordered w-full" type="password" autoComplete="new-password" placeholder="Nieuw wachtwoord (min. 12 tekens)" value={pw} onChange={(e) => setPw(e.target.value)} />
            <input className="input input-bordered w-full" type="password" autoComplete="new-password" placeholder="Herhaal wachtwoord" value={pw2} onChange={(e) => setPw2(e.target.value)} />
            <button className="btn btn-primary w-full">Opslaan en inloggen</button>
          </>
        )}
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
