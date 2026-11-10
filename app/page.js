import Link from "next/link";

const COMMUNITY = "https://officialwfhclub.samcart.com/products/community-access-annual-membership";

const features = [
  ["Resumes", "Rebuild an outdated resume into a clean, ATS-friendly one, using only your real experience."],
  ["Job matching", "Paste a job post and see your Strong, Moderate, or Low match, with honest gaps."],
  ["Remote job search", "Realistic job titles, search keywords, and a weekly plan that fits your schedule."],
  ["Interview prep", "Practice one question at a time and get feedback built from your real stories."],
  ["LinkedIn and cover letters", "Headlines, About sections, screening answers, and follow-up emails."],
  ["Scam awareness", "Learn the warning signs so you can spot fake work-from-home jobs."],
];

const faqs = [
  ["Is Remi a real person?", "No. Remi is an AI career assistant created for The Official WFH Club. Remi can help you prepare stronger applications, but isn't a human recruiter."],
  ["Is it free?", "Yes, during the trial. You'll need an access code from The Official WFH Club."],
  ["Is my information private?", "Your chats aren't saved on this site. Never share passwords, Social Security numbers, or bank details with Remi."],
  ["Can Remi get me a job?", "No one can promise that. Remi helps you find roles that fit, strengthen your applications, and prepare for interviews."],
];

export default function Home() {
  return (
    <main className="landing">
      <nav className="nav">
        <div className="brand"><span className="avatar">R</span> Remi</div>
        <Link href="/chat" className="btn small">Start free</Link>
      </nav>

      <section className="hero">
        <p className="eyebrow">The Official WFH Club</p>
        <h1>Meet Remi, your AI career assistant</h1>
        <p className="lead">Find legitimate remote work and land it. Remi helps moms with resumes, job matching, interview prep, and a job search that fits real life.</p>
        <Link href="/chat" className="btn">Start free</Link>
      </section>

      <section className="grid">
        {features.map(([t, d]) => (
          <div key={t} className="card"><h3>{t}</h3><p>{d}</p></div>
        ))}
      </section>

      <section className="faq">
        <h2>Questions</h2>
        {faqs.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <footer className="footer">
        <a href={COMMUNITY} target="_blank" rel="noopener noreferrer">Join The Official WFH Club community</a>
        <p>Remi is an AI assistant and can make mistakes. Always confirm jobs on the company's official careers page.</p>
      </footer>
    </main>
  );
}
