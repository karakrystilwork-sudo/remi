"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GREETING =
  "Hi! I'm Remi, your AI career assistant from The Official WFH Club! I'm here to make your remote job search a little easier, whether you're starting fresh, returning to work, or looking for your next opportunity. I can help with resumes, job matching, LinkedIn, interview prep, and more. What would you like to work on today?";

function load(key) {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}
function save(key, val) {
  try { val ? localStorage.setItem(key, val) : localStorage.removeItem(key); } catch {}
}

export default function Chat() {
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { setCode(load("remi-code")); setReady(true); }, []);
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [messages]);

  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    setError("");
    setInput("");
    const next = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "x-access-code": code },
        body: JSON.stringify({ messages: next.slice(1) }), // greeting is shown, not sent
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) { save("remi-code", ""); setCode(""); }
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let out = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: out }]);
      }
      if (!out) throw new Error("Remi didn't answer. Try again.");
    } catch (e) {
      setMessages(next.slice(0, -1));
      setInput(q);
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/\.(txt|md)$/i.test(f.name)) {
      setError("For now, upload a .txt file or paste your resume text into the box.");
      return;
    }
    const text = await f.text();
    setInput((prev) => (prev ? prev + "\n\n" : "") + "Here's my resume:\n\n" + text);
  }

  function newChat() {
    if (busy) return;
    setMessages([{ role: "assistant", content: GREETING }]);
    setError("");
  }

  if (!ready) return null;

  if (!code) {
    return (
      <main className="gate">
        <form
          className="card gate-card"
          onSubmit={(e) => { e.preventDefault(); const c = codeInput.trim(); if (c) { save("remi-code", c); setCode(c); } }}
        >
          <div className="avatar big">R</div>
          <h1>Welcome to Remi</h1>
          <p>Enter the access code from The Official WFH Club to start your free trial.</p>
          <input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Access code" autoFocus />
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit">Start chatting</button>
          <Link href="/" className="muted">Back to home</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="chat">
      <header className="chat-head">
        <Link href="/" className="brand"><span className="avatar">R</span><span><b>Remi</b><small>The Official WFH Club</small></span></Link>
        <button className="btn ghost" onClick={newChat} disabled={busy}>New chat</button>
      </header>

      <div className="log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={"msg " + (m.role === "user" ? "user" : "remi")}>
            {m.content || (busy && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
        {error && <div className="error center">{error}</div>}
      </div>

      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <button type="button" className="btn ghost attach" onClick={() => fileRef.current?.click()} title="Attach a .txt resume">+</button>
        <input ref={fileRef} type="file" accept=".txt,.md" hidden onChange={onFile} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Message Remi… (paste your resume or a job post anytime)"
          rows={2}
        />
        <button className="btn" disabled={busy || !input.trim()}>Send</button>
      </form>
      <p className="disclaimer">Remi is AI and can make mistakes. Never share passwords, SSNs, or bank details.</p>
    </main>
  );
}
