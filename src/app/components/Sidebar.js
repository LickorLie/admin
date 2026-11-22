"use client";
import { usePathname } from "next/navigation";
import supabase from "../utils/supabase";

const LINKS = [
  ["/dashboard", "Kaarten"],
  ["/dashboard/submissions", "Ingestuurde kaarten"],
  ["/dashboard/events", "Agenda"],
  ["/dashboard/places", "Clubs & plekken"],
  ["/dashboard/posts", "Blog"],
  ["/dashboard/polls", "Vraag van de week"],
  ["/dashboard/partners", "Partners (AWIN)"],
  ["/dashboard/sponsors", "Deals & advertenties"],
  ["/dashboard/contact", "Contact"],
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-base-100 border-r border-base-300 p-4 hidden md:block min-h-screen">
      <div className="font-serif text-2xl font-semibold mb-6 px-2">
        Lick <i className="text-primary">or</i> Lie
      </div>
      <ul className="menu w-full p-0">
        {LINKS.map(([href, label]) => (
          <li key={href}>
            <a href={href} className={path === href ? "menu-active" : ""}>{label}</a>
          </li>
        ))}
      </ul>
      <button className="btn btn-ghost btn-sm mt-6" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}>Uitloggen</button>
    </aside>
  );
}

/* Mobiel: menu als dropdown bovenaan */
export function MobileNav() {
  const path = usePathname();
  return (
    <select className="select select-bordered w-full mb-4 md:hidden" value={path}
      onChange={(e) => (window.location.href = e.target.value)}>
      {LINKS.map(([href, label]) => <option key={href} value={href}>{label}</option>)}
    </select>
  );
}
