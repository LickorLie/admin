"use client";

import { useEffect, useState } from "react";
import supabase from "../../utils/supabase"; // Adjust the import path as necessary
export default function ContactViewer() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
 // if no user, redirect to login
  useEffect(() => {
    async function checkSession() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log("Session:", user);
    if (!user || error) {
      console.error("No user session found:", error);
      window.location.href = `${window.location.origin}/`; // Redirect to login if no session
    }}
    checkSession();
  }, []); 
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contact")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setContacts(data);
  };

  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <div className="min-h-screen flex bg-base-200">

          {/* Sidebar */}
      <aside className="w-64 bg-base-100 p-4 shadow hidden md:block">
        <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>
        <ul className="menu space-y-2">
          <li><a href="/dashboard">🏠 Questions ↗</a></li>
          <li><a href="sponsors">🎁 Sponsors ↗</a></li>
          <li><a className="active">📬 Contact</a></li>
        </ul>
      </aside>


    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📬 Contact Submissions</h1>
          <input
            type="text"
            placeholder="Search by name..."
            className="input input-bordered"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500">No contact submissions found.</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="card bg-base-100 shadow p-4">
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-sm text-gray-400">{c.email}</p>
                <p className="badge badge-outline my-2">{c.type}</p>
                <p className="whitespace-pre-wrap">{c.message}</p>
                              <a href={`mailto:${c.email}?subject=Re: ${c.name}&body=Hi ${c.name},\n\n`} className="btn btn-primary mt-2 w-24">
                📤 Reply
                </a>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
