"use client";

import { useState, useEffect } from "react";
import supabase from "../../utils/supabase"; // Adjust the import path as necessary

export default function SponsorDashboard() {
  const [sponsors, setSponsors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editCache, setEditCache] = useState({});
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
  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setSponsors(data);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const filteredSponsors = sponsors.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditToggle = (s) => {
    setEditingId(s.id);
    setEditCache({ ...s });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCache((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    await supabase.from("sponsors").update(editCache).eq("id", editCache.id);
    setEditingId(null);
    fetchSponsors();
  };

  const handleDelete = async (id) => {
    await supabase.from("sponsors").delete().eq("id", id);
    fetchSponsors();
  };

  const handleCreate = async () => {
    await supabase.from("sponsors").insert([
      {
        title: "New Sponsor",
        description: "",
        image: "",
        link: "",
        discount: "",
        is_fullscreen: false,
      },
    ]);
    fetchSponsors();
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 p-4 shadow-lg hidden md:block">
        <h2 className="text-xl font-bold mb-4">📊 Dashboard</h2>
        <ul className="menu">
          <li><a className="active">Sponsors</a></li>
          {/* Add more navigation items here if needed */}
            <li><a href="/dashboard">Questions ↗</a></li>
                        <li><a href="/dashboard/contact">Contact ↗ </a></li>

        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-3xl font-bold">🎁 Manage Sponsors</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search title..."
              className="input input-bordered"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleCreate}>
              ➕ Add Sponsor
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredSponsors.map((sponsor) => (
            <div key={sponsor.id} className="card bg-base-100 shadow-md p-4 space-y-2">
              {editingId === sponsor.id ? (
                <>
                  <input
                    name="title"
                    className="input input-bordered w-full"
                    value={editCache.title}
                    onChange={handleEditChange}
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    className="textarea textarea-bordered w-full"
                    value={editCache.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  />
                  <input
                    name="image"
                    className="input input-bordered w-full"
                    value={editCache.image}
                    onChange={handleEditChange}
                    placeholder="Image URL"
                  />
                  <input
                    name="link"
                    className="input input-bordered w-full"
                    value={editCache.link}
                    onChange={handleEditChange}
                    placeholder="Link"
                  />
                  <input
                    name="discount"
                    className="input input-bordered w-full"
                    value={editCache.discount}
                    onChange={handleEditChange}
                    placeholder="Discount"
                  />
                  <label className="label cursor-pointer gap-2">
                    <span>Fullscreen?</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="is_fullscreen"
                      checked={editCache.is_fullscreen}
                      onChange={handleEditChange}
                    />
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                      ✅ Save
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{sponsor.title}</h3>
                  <p className="text-sm">{sponsor.description}</p>
                  {sponsor.image && (
                    <img
                      src={sponsor.image}
                      alt="Sponsor"
                      className="w-full max-h-40 object-contain rounded"
                    />
                  )}
                  <p>
                    <strong>Link:</strong>{" "}
                    <a href={sponsor.link} className="link" target="_blank" rel="noopener noreferrer">
                      {sponsor.link}
                    </a>
                  </p>
                  <p>
                    <strong>Discount:</strong> {sponsor.discount} |{" "}
                    <strong>Fullscreen:</strong> {sponsor.is_fullscreen ? "Yes" : "No"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditToggle(sponsor)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(sponsor.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
