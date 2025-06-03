"use client";

import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function QuestionDashboard() {
  const [questions, setQuestions] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [form, setForm] = useState({
    id: null,
    question: "",
    theme: "",
    level: "",
    type: "",
    requirespartner: false,
  });
  const [loading, setLoading] = useState(false);
  
  const fetchQuestions = async (theme = null) => {
    let query = supabase.from("questions").select("*").order("created_at", { ascending: false });

    if (theme) {
      query = query.eq("theme", theme);
    }

    const { data, error } = await query;

    if (!error) setQuestions(data);
  };

  const fetchThemes = async () => {
    const { data, error } = await supabase.from("questions").select("theme");

    if (!error) {
      const uniqueThemes = [...new Set(data.map((q) => q.theme).filter(Boolean))];
      setThemes(uniqueThemes);
    }
  };

  useEffect(() => {
    
    fetchQuestions();
    fetchThemes();
  }, []);
  
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

  const handleThemeFilter = (theme) => {
    setSelectedTheme(theme);
    fetchQuestions(theme);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id, ...values } = form;

    if (id) {
      await supabase.from("questions").update(values).eq("id", id);
    } else {
      await supabase.from("questions").insert([values]);
    }

    setForm({ id: null, question: "", theme: "", level: "", type: "", requirespartner: false });
    await fetchQuestions(selectedTheme);
    await fetchThemes();
    setLoading(false);
  };

  const handleEdit = (q) => {
    setForm(q);
  };

  async function handleDelete(id){

const { data, error } = await supabase
  .from('questions')
  .delete()
  .eq('id', id).select('*'); // Assuming you want to delete by id
console.log(data)
       
    fetchQuestions(selectedTheme);

  };
 const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = `${window.location.origin}/`; // Redirect to login after logout
    }
  }
  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-base-100 shadow-lg p-4 hidden md:block">
        <h3 className="font-bold text-lg mb-4">🎨 Filter by Theme</h3>
        <ul className="menu">
          <li>
            <button
              className={`btn btn-ghost btn-sm text-left ${selectedTheme === null ? "font-bold" : ""}`}
              onClick={() => handleThemeFilter(null)}
            >
              All Themes
            </button>
          </li>
          {themes.map((theme) => (
            <li key={theme}>
              <button
                className={`btn btn-ghost btn-sm text-left ${selectedTheme === theme ? "font-bold" : ""}`}
                onClick={() => handleThemeFilter(theme)}
              >
                {theme}
              </button>
            </li>
          ))}
            <li><a href="/dashboard/sponsors">Manage Sponsors ↗ </a></li>
                        <li><a href="/dashboard/contact">Contact ↗ </a></li>
                        <li><a onClick={logout}>Logout ←</a></li>

        </ul>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">📚 Manage Questions</h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-4 mb-6 space-y-4">
            <div className="form-control">
              <label className="label">Question</label>
              <textarea name="question" className="textarea textarea-bordered" value={form.question} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Theme</label>
                <input name="theme" className="input input-bordered" value={form.theme} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label">Level</label>
                <input name="level" className="input input-bordered" value={form.level} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label">Type</label>
                <input name="type" className="input input-bordered" value={form.type} onChange={handleChange} />
              </div>
              <div className="form-control flex-row items-center gap-2 mt-6">
                <label className="label">Requires Partner</label>
                <input type="checkbox" className="checkbox" name="requirespartner" checked={form.requirespartner} onChange={handleChange} />
              </div>
            </div>

            <button className="btn btn-primary w-full mt-2" disabled={loading}>
              {form.id ? "Update Question" : "Add Question"}
            </button>
          </form>

          {/* QUESTION LIST */}
          <div className="space-y-4">
            {questions.length === 0 && <p>No questions found.</p>}
            {questions.map((q) => (
              <div key={q.id} className="card bg-base-100 shadow p-4">
                <h3 className="font-semibold text-lg">{q.question || "No Question Text"}</h3>
                <p><strong>Theme:</strong> {q.theme} | <strong>Level:</strong> {q.level} | <strong>Type:</strong> {q.type}</p>
                <p><strong>Partner Required:</strong> {q.requirespartner ? "Yes" : "No"}</p>
                <div className="mt-2 flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(q)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(q.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
