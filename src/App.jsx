import { useState, useEffect, useRef } from "react";
import "./index.css";

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── useParallax ── */
function useParallax(speed = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      ref.current.style.transform = `translateY(${window.scrollY * speed}px)`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);
  return ref;
}

/* ── Reveal ── */
function Reveal({ children, delay = 0, direction = "up", className = "", style = {} }) {
  const [ref, inView] = useInView();
  const map = { up: "translateY(50px)", left: "translateX(-50px)", right: "translateX(50px)" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : map[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── SectionLabel ── */
function SectionLabel({ label }) {
  return (
    <div className="section-label">
      <span>{label}</span>
    </div>
  );
}

/* ════════════════════════════════
   NAVBAR
════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["About", "Skills", "Projects", "Experience", "Coding", "Achievements", "Contact"];
  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">TR.</a>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════════
   HERO
════════════════════════════════ */
function Hero() {
  const parallaxRef = useParallax(0.25);
  const [typed, setTyped] = useState("");
  const titles = ["Full Stack Developer", "Python Developer", "MERN Stack Developer", "Problem Solver"];
  const [tIdx, setTIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = titles[tIdx];
    let t;
    if (!deleting && typed.length < current.length)
      t = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 85);
    else if (!deleting && typed.length === current.length)
      t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && typed.length > 0)
      t = setTimeout(() => setTyped(current.slice(0, typed.length - 1)), 45);
    else { setDeleting(false); setTIdx((tIdx + 1) % titles.length); }
    return () => clearTimeout(t);
  }, [typed, deleting, tIdx]);

  return (
    <section id="home" className="hero">
      <div className="hero-orbs" ref={parallaxRef}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>
      <div className="hero-dots" />
      <div className="hero-content">
        <Reveal delay={0.1}>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Available for opportunities</span>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="hero-name">
            <span className="first">Tatapudi</span><br />
            <span className="accent">Ramesh</span>
          </h1>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="hero-typed">
            <span className="typed-text">{typed}</span>
            <span className="cursor">|</span>
          </div>
        </Reveal>
        <Reveal delay={0.5}>
          <p className="hero-desc">
            Aspiring Software Engineer crafting scalable web apps with Python, Django & the MERN stack.
            Turning complex ideas into elegant digital experiences.
          </p>
        </Reveal>
        <Reveal delay={0.62}>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary">View My Work →</a>
            <a href="#contact" className="btn-outline">Get In Touch</a>
          </div>
        </Reveal>
        <Reveal delay={0.78}>
          <div className="hero-stats">
            {[["2+", "Internships"], ["3+", "Projects"], ["8.83", "CGPA"]].map(([n, l]) => (
              <div key={l} className="stat">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="scroll-indicator">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

/* ════════════════════════════════
   ABOUT
════════════════════════════════ */
function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <Reveal><SectionLabel label="About Me" /></Reveal>
        <div className="about-grid">
          <Reveal direction="left" delay={0.1}>
            <div className="avatar-wrap">
              <div className="avatar-border">
                <img
                  src="src/assets/ramesh.jpg"
                  alt="Tatapudi Ramesh"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "30px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="avatar-badge">B.Tech CSE · 8.89 CGPA</div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div>
              <h2 className="section-title">
                Building the future,<br />
                <span className="accent">one commit at a time.</span>
              </h2>
              <div className="about-bio">
                <p>I'm Tatapudi Ramesh, a passionate Computer Science student at Aditya University, Surampalem (Expected May 2027) with a strong CGPA of 8.83. I hold a Diploma in Computer Engineering from Andhra Polytechnic, Kakinada with 90.71%.</p>
                <p>I've gained real-world experience through internships at Krify Software Technologies (Python Full Stack with Django) and AIMS Technologies (MERN Stack), building web applications and collaborating across teams.</p>
                <p>My expertise spans Python, Django, ReactJS, Node.js, Express.js, and Flutter. I'm currently deepening my MERN stack skills and exploring competitive programming.</p>
                <p>When I'm not coding, I'm exploring new technologies, attending workshops.</p>
              </div>
              <div className="about-tags">
                {["📍 Pithapuram, AP", "🎓 Aditya University", "💼 Open to Work", "⚡ MERN Stack"].map(t => (
                  <span key={t} className="about-tag">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   SKILLS
════════════════════════════════ */
const skillsData = [
  { cat: "Languages", color: "#00F5C4", items: [{ n: "Python", e: "🐍", p: 90 }, { n: "JavaScript", e: "⚡", p: 85 }, { n: "Java", e: "☕", p: 75 }, { n: "C/C++", e: "⚙️", p: 70 }] },
  { cat: "Frontend", color: "#3B82F6", items: [{ n: "React", e: "⚛️", p: 85 }, { n: "HTML/CSS", e: "🎨", p: 92 }, { n: "Bootstrap", e: "🅱️", p: 80 }, { n: "Flutter", e: "🦋", p: 72 }] },
  { cat: "Backend", color: "#8B5CF6", items: [{ n: "Django", e: "🦄", p: 85 }, { n: "Node.js", e: "🟢", p: 78 }, { n: "Express.js", e: "🚂", p: 75 }, { n: "REST APIs", e: "🔗", p: 82 }] },
  { cat: "Tools & DB", color: "#F59E0B", items: [{ n: "Git/GitHub", e: "🐙", p: 88 }, { n: "MySQL", e: "🗄️", p: 78 }, { n: "SQLite", e: "💾", p: 80 }, { n: "VS Code", e: "💻", p: 92 }] },
];

function SkillBar({ n, e, p, color, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className="skill-bar-row" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)", transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` }}>
      <div className="skill-bar-meta">
        <span className="skill-bar-name">{e} {n}</span>
        <span className="skill-bar-pct" style={{ color }}>{p}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: inView ? `${p}%` : "0%", background: `linear-gradient(90deg,${color},${color}88)`, transition: `width 1.4s ease ${delay + 0.2}s` }} />
      </div>
    </div>
  );
}

function Skills() {
  const badges = ["Python","Django","FastAPI","ReactJS","Node.js","Express.js","Flutter","Dart","HTML5","CSS3","JavaScript","Bootstrap","Git","GitHub","MySQL","SQLite","REST APIs","Java","C/C++","RabbitMQ","Docker","Redis","VS Code","WebSockets","JWT","OAuth","Linux","Agile Methodologies"];
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <Reveal><SectionLabel label="Technical Skills" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">My <span className="accent">Tech Stack</span></h2></Reveal>
        <div className="skills-grid">
          {skillsData.map((cat, ci) => (
            <Reveal key={cat.cat} delay={ci * 0.1}>
              <div className="skill-card">
                <div className="skill-card-top" style={{ background: `linear-gradient(90deg,${cat.color},transparent)` }} />
                <div className="skill-cat" style={{ color: cat.color }}>{cat.cat}</div>
                {cat.items.map((s, si) => (
                  <SkillBar key={s.n} {...s} color={cat.color} delay={ci * 0.1 + si * 0.08} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="badges-wrap">
            {badges.map(b => <span key={b} className="badge">{b}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   PROJECTS
════════════════════════════════ */
const projectsData = [
  {
    title: "School Management System", emoji: "🏫", color: "#00F5C4",
    desc: "A full-featured web app for managing students, teachers, and attendance. Includes email notifications, reporting dashboards, and a clean admin interface built with Django and Bootstrap.",
    tech: ["Django", "HTML/CSS", "JavaScript", "Bootstrap", "SQLite"],
    github: "https://github.com/Ramesh-Tatapudi2005/SchoolManagementSystem",
  },
  {
    title: "Async Payment Gateway", emoji: "💳", color: "#3B82F6",
    desc: "A high-performance asynchronous payment gateway supporting concurrent transaction processing. Built with async architecture for reliability, featuring webhook handling and real-time payment status updates.",
    tech: ["Node.js", "Async/Await", "REST APIs", "JavaScript"],
    github: "https://github.com/Ramesh-Tatapudi2005/payment-gateway-v2-async",
  },
  {
    title: "AI Form Generator", emoji: "🤖", color: "#8B5CF6",
    desc: "An intelligent form builder that uses AI to auto-generate dynamic forms from plain text prompts. Supports multiple field types, validation rules, and instant preview — no manual form coding needed.",
    tech: ["ReactJS", "AI/LLM API", "JavaScript", "CSS"],
    github: "https://github.com/Ramesh-Tatapudi2005/ai-form-generator",
  },
  {
    title: "Distributed Job Processor", emoji: "⚙️", color: "#F59E0B",
    desc: "A scalable distributed system for processing background jobs across multiple workers. Features job queuing, retry logic, worker health monitoring, and real-time status tracking for high-throughput task execution.",
    tech: ["Node.js", "Job Queue", "Distributed Systems", "JavaScript"],
    github: "https://github.com/Ramesh-Tatapudi2005/job-processor-system",
  },
  {
    title: "Dictionary App", emoji: "📖", color: "#EC4899",
    desc: "A responsive ReactJS dictionary app that fetches real-time word definitions, synonyms, antonyms, and usage examples from the Dictionary API. Features loading/error handling and optimized API fetch cycles for seamless UX.",
    tech: ["ReactJS", "JavaScript", "Dictionary API", "CSS"],
    github: "https://github.com/Ramesh-Tatapudi2005/Dictionary-App",
  },
  {
    title: "URL Shortener", emoji: "🔗", color: "#14B8A6",
    desc: "A Python-based URL shortening service that converts long URLs into clean, shareable short links. Handles redirect logic, stores mappings, and provides a simple interface for generating and managing shortened URLs.",
    tech: ["Python", "URL Routing", "Backend", "REST"],
    github: "https://github.com/Ramesh-Tatapudi2005/url_shortener",
  },
];

function ProjectCard({ proj, delay }) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(60px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        borderColor: hovered ? `${proj.color}35` : "rgba(255,255,255,0.06)",
        boxShadow: hovered ? `0 20px 60px ${proj.color}15` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-card-line" style={{ background: `linear-gradient(90deg,${proj.color},transparent)`, opacity: hovered ? 1 : 0.45 }} />
      <span className="project-emoji">{proj.emoji}</span>
      <h3 className="project-title">{proj.title}</h3>
      <p className="project-desc">{proj.desc}</p>
      <div className="project-techs">
        {proj.tech.map(t => (
          <span key={t} className="tech-tag" style={{ background: `${proj.color}12`, color: proj.color, border: `1px solid ${proj.color}28` }}>{t}</span>
        ))}
      </div>
      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="project-link" style={{ color: proj.color }}>
        GitHub Repo →
      </a>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <Reveal><SectionLabel label="Projects" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Things I've <span className="accent">Built</span></h2></Reveal>
        <div className="projects-grid">
          {projectsData.map((proj, i) => <ProjectCard key={proj.title} proj={proj} delay={i * 0.15} />)}
        </div>
        <Reveal delay={0.4}>
          <div className="projects-cta">
            <a href="https://github.com/Ramesh-Tatapudi2005" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              View All on GitHub →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   EXPERIENCE
════════════════════════════════ */
const expData = [
  {
    role: "MERN Stack Intern", company: "AIMS Technologies, Kakinada",
    period: "May 2025 – July 2025", color: "#00F5C4",
    points: [
      "Designed & built 3+ responsive web pages using ReactJS with reusable components",
      "Integrated REST APIs using Axios, managed state with useState and useEffect hooks",
      "Reduced page load time by optimizing images and React component rendering",
      "Collaborated with backend team using Node.js and Express.js to develop API endpoints",
    ],
  },
  {
    role: "Software Engineer Intern", company: "Krify Software Technologies, Kakinada",
    period: "Nov 2023 – May 2024", color: "#3B82F6",
    points: [
      "Completed hands-on training in Python Full Stack Development using Django framework",
      "Built and deployed 2+ web modules with user login, CRUD operations, and dashboards",
      "Improved front-end UI performance and accessibility using HTML/CSS/JS best practices",
      "Documented system workflows and debugged critical components across SDLC stages",
    ],
  },
];

function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <Reveal><SectionLabel label="Experience" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Work <span className="accent">Experience</span></h2></Reveal>
        <div className="timeline">
          {expData.map((exp, i) => (
            <Reveal key={exp.company} direction="left" delay={i * 0.18}>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: exp.color, boxShadow: `0 0 14px ${exp.color}80` }} />
                <div className="exp-card" style={{ borderColor: `${exp.color}18` }}>
                  <div className="exp-header">
                    <div>
                      <div className="exp-role">{exp.role}</div>
                      <div className="exp-company" style={{ color: exp.color }}>{exp.company}</div>
                    </div>
                    <span className="exp-period" style={{ background: `${exp.color}14`, color: exp.color }}>{exp.period}</span>
                  </div>
                  <ul className="exp-points">
                    {exp.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   CODING PLATFORMS
════════════════════════════════ */
const platforms = [
  { name: "GitHub", handle: "Ramesh-Tatapudi2005", url: "https://github.com/Ramesh-Tatapudi2005", icon: "🐙", color: "#E8EDF5", desc: "Open-source projects & code" },
  { name: "LeetCode", handle: "Tatapudi_Ramesh", url: "https://leetcode.com/u/Ramesh-Tatapudi/", icon: "🧠", color: "#F59E0B", desc: "DSA & problem solving" },
  { name: "HackerRank", handle: "Tatapudi_Ramesh", url: "https://www.hackerrank.com/profile/tatapudirameshr1", icon: "💚", color: "#00EA64", desc: "Coding challenges" },
  { name: "GeeksforGeeks", handle: "Tatapudi_Ramesh", url: "https://www.geeksforgeeks.org/profile/tatapudiramarlf", icon: "🌿", color: "#2F8D46", desc: "CS fundamentals & articles" },
  { name: "CodeChef", handle: "Tatapudi_Ramesh", url: "https://www.codechef.com/users/ramesh_ram123r", icon: "👨‍🍳", color: "#B17C3A", desc: "Competitive programming" },
];

function CodingPlatforms() {
  return (
    <section id="coding" className="section coding-section">
      <div className="container">
        <Reveal><SectionLabel label="Coding Platforms" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Where I <span className="accent">Code</span></h2></Reveal>
        <div className="coding-grid">
          {platforms.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="platform-link">
                <div className="platform-card">
                  <span className="platform-icon">{p.icon}</span>
                  <div className="platform-name">{p.name}</div>
                  <div className="platform-handle" style={{ color: p.color }}>@{p.handle}</div>
                  <div className="platform-desc">{p.desc}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   ACHIEVEMENTS
════════════════════════════════ */
const achData = [
  { icon: "🎮", title: "APSSDC Game Design Workshop", desc: "Attended a 7-day workshop on Game Designing using Buildbox, gaining hands-on exposure to visual game development tools and design fundamentals." },
  { icon: "☕", title: "Java Essentials Bootcamp", desc: "Completed a 3-day Java Essentials Bootcamp by Let's Upgrade and earned certification in core Java programming fundamentals." },
  { icon: "🎓", title: "Academic Excellence", desc: "Maintaining 8.83 CGPA in B.Tech CSE at Aditya University. Scored 90.71% in Diploma from Andhra Polytechnic, Kakinada." },
];

function Achievements() {
  return (
    <section id="achievements" className="section achievements-section">
      <div className="container">
        <Reveal><SectionLabel label="Achievements" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Milestones & <span className="accent">Wins</span></h2></Reveal>
        <div className="ach-grid">
          {achData.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.15}>
              <div className="ach-card">
                <span className="ach-icon">{a.icon}</span>
                <div className="ach-title">{a.title}</div>
                <p className="ach-desc">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   CONTACT
════════════════════════════════ */
const contactLinks = [
  { icon: "📧", label: "Email", val: "Tatapudirameshramesh3@gmail.com", href: "mailto:Tatapudirameshramesh3@gmail.com", color: "#00F5C4" },
  { icon: "🐙", label: "GitHub", val: "github.com/Ramesh-Tatapudi2005", href: "https://github.com/Ramesh-Tatapudi2005", color: "#E8EDF5" },
  { icon: "💼", label: "LinkedIn", val: "linkedin.com/in/tatapudi-ramesh-219b12228", href: "https://www.linkedin.com/in/tatapudi-ramesh-219b12228", color: "#3B82F6" },
  { icon: "📞", label: "Phone", val: "+91 832 866 829", href: "tel:+91832866829", color: "#8B5CF6" },
];

function Contact() {
  const parallaxRef = useParallax(0.12);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <section id="contact" className="section contact-section">
      <div className="contact-orbs" ref={parallaxRef}>
        <div className="orb orb-c1" />
        <div className="orb orb-c2" />
      </div>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal><SectionLabel label="Contact" /></Reveal>
        <Reveal delay={0.1}><h2 className="section-title">Let's <span className="accent">Connect</span></h2></Reveal>
        <Reveal delay={0.15}><p className="contact-intro">Open to internships, full-time roles, and exciting projects. Drop a message and let's build something great together.</p></Reveal>
        <div className="contact-grid">
          <Reveal direction="left" delay={0.2}>
            <div className="contact-links">
              {contactLinks.map(c => (
                <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="contact-link-item">
                  <div className="contact-link-icon" style={{ background: `${c.color}12` }}>{c.icon}</div>
                  <div>
                    <div className="contact-link-label">{c.label}</div>
                    <div className="contact-link-val" style={{ color: c.color }}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.3}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input required className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input required type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea required rows={5} className="form-input" placeholder="Let's work together..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className={`btn-submit ${sent ? "sent" : ""}`}>
                {sent ? "✓ Message Sent!" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   FOOTER
════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">TR.</div>
      <div className="footer-tagline">Tatapudi Ramesh · Full Stack Developer · Pithapuram, AP</div>
      <div className="footer-links">
        <a href="https://github.com/Ramesh-Tatapudi2005" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/tatapudi-ramesh-219b12228" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:Tatapudirameshramesh3@gmail.com">Email</a>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Tatapudi Ramesh. Built with React + Vite.</div>
    </footer>
  );
}

/* ════════════════════════════════
   APP
════════════════════════════════ */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <CodingPlatforms />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
