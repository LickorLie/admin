"use client";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

/* Inloggen met e-mail + wachtwoord. De sessie blijft bewaard op dit apparaat,
   zodat je niet steeds opnieuw hoeft in te loggen. */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/dashboard";
    });
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg("Inloggen mislukt. Controleer je e-mail en wachtwoord, of stel eerst een wachtwoord in.");
    else window.location.href = "/dashboard";
  };

  const sendReset = async () => {
    if (!email) { setMsg("Vul eerst je e-mailadres in."); return; }
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    setMsg(error ? "Versturen mislukt: " + error.message : "Check je mail: klik op de link om je wachtwoord in te stellen.");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <form onSubmit={login} className="w-full max-w-sm card bg-base-100 border border-base-300 p-6 gap-3">
        <div className="font-serif text-4xl font-semibold mb-1">Lick <i className="text-primary">or</i> Lie</div>
        <p className="opacity-70 mb-2">Beheer</p>
        <input className="input input-bordered w-full" type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input input-bordered w-full" type="password" autoComplete="current-password" placeholder="Wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-full" disabled={busy}>Inloggen</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={sendReset} disabled={busy}>Wachtwoord instellen of vergeten?</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
