// src/app/admin/page.jsx
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases, storage, account } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ILLUSTRATIONS_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

const emptyForm = {
  id: null,
  title: "",
  description: "",
  date: "",
  tools: "", // comma-separated in the form, split into an array on save
  sort_order: 0,
  thumbnail_file_id: null,
  full_file_id: null,
  social_link: "",
};

const fileUrl = (fileId) =>
  fileId ? storage.getFileView(BUCKET_ID, fileId) : null;

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [illustrations, setIllustrations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [thumbFile, setThumbFile] = useState(null);
  const [fullFile, setFullFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  //Date to Day
  const todayPlaceholder = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // Guard the route — bounce to login if no session
  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        setCheckingSession(false);
        loadIllustrations();
      } catch {
        router.push("/admin/login");
      }
    };
    checkSession();
  }, [router]);

  const loadIllustrations = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderAsc("sort_order")]
      );
      setIllustrations(res.documents);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await account.deleteSession("current");
    router.push("/admin/login");
  };

  const uploadImage = async (file) => {
    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
    return uploaded.$id;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setThumbFile(null);
    setFullFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let thumbnail_file_id = form.thumbnail_file_id;
      let full_file_id = form.full_file_id;

      if (thumbFile) thumbnail_file_id = await uploadImage(thumbFile);
      if (fullFile) full_file_id = await uploadImage(fullFile);

      if (!form.id && (!thumbnail_file_id || !full_file_id)) {
        throw new Error("Please choose both a thumbnail and a full image.");
      }

      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        tools: form.tools.split(",").map((t) => t.trim()).filter(Boolean),
        sort_order: Number(form.sort_order) || 0,
        thumbnail_file_id,
        full_file_id,
        social_link: form.social_link,
      };

      if (form.id) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, form.id, payload);
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
      }

      resetForm();
      loadIllustrations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (piece) => {
    setForm({
      id: piece.$id,
      title: piece.title,
      description: piece.description || "",
      date: piece.date || "",
      tools: (piece.tools || []).join(", "),
      sort_order: piece.sort_order || 0,
      thumbnail_file_id: piece.thumbnail_file_id,
      full_file_id: piece.full_file_id,
      social_link: piece.social_link || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this piece? This can't be undone.")) return;
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      loadIllustrations();
    } catch (err) {
      setError(err.message);
    }
  };

  if (checkingSession) return null;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <h1>Illustrations</h1>
        <button onClick={handleLogout} className="admin-logout-btn">Log out</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{form.id ? "Edit piece" : "Add a new piece"}</h2>

        <label className="admin-field">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>

        <label className="admin-field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label className="admin-field">
          <span>Date</span>
          <input
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder={todayPlaceholder}
          />
        </label>

        <label className="admin-field">
          <span>Tools (comma-separated)</span>
          <input
            value={form.tools}
            onChange={(e) => setForm({ ...form, tools: e.target.value })}
            placeholder="Clip Studio Paint, Blender"
          />
        </label>

        <label className="admin-field">
          <span>Social Post Link</span>
          <input
            value={form.social_link}
            onChange={(e) => setForm({ ...form, social_link: e.target.value })}
            placeholder="https://x.com/..."
          />
        </label>

        <label className="admin-field">
          <span>Sort order</span>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </label>

        <label className="admin-field">
          <span>Thumbnail image {form.id ? "(leave blank to keep current)" : ""}</span>
          <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} />
        </label>

        <label className="admin-field">
          <span>Full-size image {form.id ? "(leave blank to keep current)" : ""}</span>
          <input type="file" accept="image/*" onChange={(e) => setFullFile(e.target.files[0])} />
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="admin-submit-btn" disabled={saving}>
            {saving ? "Saving…" : form.id ? "Save changes" : "Add piece"}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="admin-cancel-btn">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        {illustrations.map((piece) => (
          <div key={piece.$id} className="admin-list-row">
            <img src={fileUrl(piece.thumbnail_file_id)} alt={piece.title} className="admin-thumb" />
            <div className="admin-list-meta">
              <strong>{piece.title}</strong>
              <span>{piece.date}</span>
            </div>
            <div className="admin-list-actions">
              <button onClick={() => handleEdit(piece)}>Edit</button>
              <button onClick={() => handleDelete(piece.$id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}