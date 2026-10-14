"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const emptyForm = {
  id: null,
  title: "",
  description: "",
  date: "",
  tools: "",
  sort_order: 0,
  thumbnail_file_id: null,
  full_file_id: null,
  social_link: "",
};

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [illustrations, setIllustrations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [thumbFile, setThumbFile] = useState(null);
  const [fullFile, setFullFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const todayPlaceholder = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const loadIllustrations = useCallback(async () => {
    const data = await apiRequest("/api/illustrations");
    setIllustrations(data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        await apiRequest("/api/auth/me");
        await loadIllustrations();
      } catch {
        if (!cancelled) {
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [loadIllustrations, router]);

  const handleLogout = async () => {
    setError("");

    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/admin/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setThumbFile(null);
    setFullFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!form.id && (!thumbFile || !fullFile)) {
        throw new Error(
          "Please choose both a thumbnail and a full-size image."
        );
      }

      const payload = new FormData();

      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("date", form.date);
      payload.append(
        "tools",
        JSON.stringify(
          form.tools
            .split(",")
            .map((tool) => tool.trim())
            .filter(Boolean)
        )
      );
      payload.append("sort_order", String(Number(form.sort_order) || 0));
      payload.append("social_link", form.social_link);

      if (thumbFile) {
        payload.append("thumbnail", thumbFile);
      }

      if (fullFile) {
        payload.append("fullImage", fullFile);
      }

      const url = form.id
        ? `/api/illustrations/${encodeURIComponent(form.id)}`
        : "/api/illustrations";

      await apiRequest(url, {
        method: form.id ? "PATCH" : "POST",
        body: payload,
      });

      resetForm();
      await loadIllustrations();
    } catch (err) {
      setError(err.message || "Failed to save illustration.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (piece) => {
    setForm({
      id: piece.id,
      title: piece.title || "",
      description: piece.description || "",
      date: piece.date || "",
      tools: Array.isArray(piece.tools)
        ? piece.tools.join(", ")
        : piece.tools || "",
      sort_order: piece.sort_order || 0,
      thumbnail_file_id: piece.thumbnail_file_id || null,
      full_file_id: piece.full_file_id || null,
      social_link: piece.social_link || "",
    });

    setThumbFile(null);
    setFullFile(null);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this piece? This can't be undone.")) {
      return;
    }

    setError("");

    try {
      await apiRequest(
        `/api/illustrations/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (form.id === id) {
        resetForm();
      }

      await loadIllustrations();
    } catch (err) {
      setError(err.message || "Failed to delete illustration.");
    }
  };

  if (checkingSession) {
    return <p>Checking admin session…</p>;
  }

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <h1>Illustrations</h1>
        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          type="button"
        >
          Log out
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{form.id ? "Edit piece" : "Add a new piece"}</h2>

        <label className="admin-field">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            maxLength={255}
            required
          />
        </label>

        <label className="admin-field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            maxLength={1000}
          />
        </label>

        <label className="admin-field">
          <span>Date</span>
          <input
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            maxLength={50}
            placeholder={todayPlaceholder}
          />
        </label>

        <label className="admin-field">
          <span>Tools (comma-separated)</span>
          <input
            value={form.tools}
            onChange={(e) =>
              setForm({ ...form, tools: e.target.value })
            }
            maxLength={100}
            placeholder="Clip Studio Paint, Blender"
          />
        </label>

        <label className="admin-field">
          <span>Social Post Link</span>
          <input
            type="url"
            value={form.social_link}
            onChange={(e) =>
              setForm({ ...form, social_link: e.target.value })
            }
            placeholder="https://x.com/..."
          />
        </label>

        <label className="admin-field">
          <span>Sort order</span>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: e.target.value })
            }
          />
        </label>

        <label className="admin-field">
          <span>
            Thumbnail image {form.id ? "(leave blank to keep current)" : ""}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbFile(e.target.files?.[0] || null)
            }
            required={!form.id}
          />
        </label>

        <label className="admin-field">
          <span>
            Full-size image {form.id ? "(leave blank to keep current)" : ""}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFullFile(e.target.files?.[0] || null)
            }
            required={!form.id}
          />
        </label>

        <div className="admin-form-actions">
          <button
            type="submit"
            className="admin-submit-btn"
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : form.id
                ? "Save changes"
                : "Add piece"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="admin-cancel-btn"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        {illustrations.map((piece) => (
          <div key={piece.id} className="admin-list-row">
            {piece.thumbnail_url && (
              <img
                src={piece.thumbnail_url}
                alt={piece.title}
                className="admin-thumb"
              />
            )}

            <div className="admin-list-meta">
              <strong>{piece.title}</strong>
              <span>{piece.date}</span>
            </div>

            <div className="admin-list-actions">
              <button type="button" onClick={() => handleEdit(piece)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(piece.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}