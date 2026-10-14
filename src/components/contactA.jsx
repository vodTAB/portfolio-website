'use client';

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_92crb42";
const TEMPLATE_ID = "template_1zca5go";
const PUBLIC_KEY = "ZKVSC7lLpBc5Iqv9R";

export default function ContactA() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        PUBLIC_KEY
      )
      .then(() => {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        setStatus("error");
      });
  };

  return (
    <div className="about-wrap">
      <form className="contact-form" onSubmit={handleSubmit}>
        <label className="admin-field">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="admin-field">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="admin-field">
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="admin-submit-btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send"}
        </button>

        {status === "sent" && <p className="contact-status success">Message sent!</p>}
        {status === "error" && <p className="contact-status error">Something went wrong — try again.</p>}
      </form>
    </div>
  );
}