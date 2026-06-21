/*
  Default content seed — the verbatim portfolio copy that used to live in
  profile.tsx. `getContent()` falls back to this when no saved document exists
  (or Vercel Blob is unavailable), so the public site always renders.
*/

import type { Content } from "./content-types";

export const defaultContent: Content = {
  personal: {
    name: "Utkarsh Verma",
    firstName: "Utkarsh",
    lastName: "Verma",
    title: "AI/ML Engineer",
    tagline: "Applied GenAI & LLM Systems",
    email: "utkarshverma759@gmail.com",
    location: "Indore, India — Open to relocation",
    greeting: "HELLO, WORLD. I AM",
    specializations: [
      "Applied GenAI & LLM Systems",
      "RAG & Agentic Pipelines",
      "Model Training & Fine Tuning",
      "Evaluation & Cost-Aware LLM Routing",
    ],
  },
  socials: {
    linkedin: "https://linkedin.com/in/utkar5h-verma",
    github: "https://github.com/UTKAR5HVERMA",
    website: "https://xcloom.com",
  },
  about: {
    paragraphs: [
      "I build GenAI systems that actually ship. Over the last 1.5+ years I've put contract intelligence, invoice automation, and multilingual voice pipelines into real enterprise products — turning messy PDFs, scanned invoices, and noisy call audio into reliable, structured answers.",
      "I like owning the whole arc: designing the RAG and agentic pipeline, wiring it up in LangGraph and FastAPI, evaluating it with RAGAS, and tuning it so it's cheap and observable in production. On the side I'm building Xcloom, my own AI social-content automation platform — because the best way to learn a system is to ship one end to end.",
    ],
    strengths: [
      "RAG & agentic systems that hold up in production",
      "Document & speech AI — PDFs and audio to structured data",
      "Evaluation-driven, cost-aware LLM engineering",
      "Full ownership, from first sketch to live deploy",
    ],
  },
  skillCategories: [
    {
      title: "Languages & Frameworks",
      icon: "code",
      skills: [
        "Python",
        "SQL",
        "FastAPI",
        "Celery",
        "Pandas",
        "NumPy",
        "Webhooks",
      ],
    },
    {
      title: "GenAI & LLM Engineering",
      icon: "brain",
      skills: [
        "LangChain",
        "LangGraph",
        "RAG",
        "Agentic Workflows",
        "Prompt Engineering",
        "LoRA Fine-tuning",
        "RAGAS Evaluation",
        "Model Context Protocol (MCP)",
        "Reranking",
        "Hugging Face Transformers",
      ],
    },
    {
      title: "Models & Data Stores",
      icon: "database",
      skills: [
        "OpenAI / GPT-4o",
        "Whisper (ASR)",
        "GPT-4o Vision",
        "PyTorch",
        "Transformers",
        "FAISS",
        "Chroma",
        "pgvector",
        "PostgreSQL",
      ],
    },
    {
      title: "MLOps & Cloud",
      icon: "cloud",
      skills: [
        "AWS (EC2, S3)",
        "Docker",
        "GitHub Actions",
        "CI/CD",
        "Model Monitoring",
        "Cloudflare R2",
      ],
    },
  ],
  experiences: [
    {
      role: "Associate Software Engineer, AI/ML",
      company: "Softude Infotech Pvt. Ltd.",
      period: "Jul 2025 – Present",
      tags: ["LangGraph", "RAG", "RAGAS", "GPT-4o Vision", "FastAPI", "pgvector"],
      projects: [
        {
          name: "Contract Intelligence (Netcore CMT)",
          desc: "Turned 2–3 hours of manual legal review into sub-minute AI processing — a ~90% cut. A LangGraph + GPT-4o pipeline over PostgreSQL/pgvector pulls 25+ structured fields (SLA, payment terms, indemnity, auto-renewal) straight from PDFs and DOCX. Hybrid retrieval, a gpt-4o-mini rerank, and a confidence gate keep it honest at >80% RAGAS faithfulness, while smart model routing makes it ~16× cheaper per token — all fully observable.",
        },
        {
          name: "Invoice Automation (Netcore P2P)",
          desc: "Reads invoices the way a human does — GPT-4o Vision with a text-first, rasterize-on-fallback strategy — pulling vendor, buyer, GST, total, and currency across 6 regional formats at ~88% field accuracy and ~60% less manual entry. A rule + AI validation layer reconciles against POs across 6 countries, hitting ~70% straight-through processing, with caching that trims ~40% of redundant token spend on bulk runs.",
        },
        {
          name: "MIS & Billing (Netcore Pulse)",
          desc: "Owned end-to-end: one MIS platform that folds SMS, Email, WhatsApp, and RCS revenue, cost, margin, and projections into a single schema — 12,000+ records a day for 200+ users. Collapsed 4 fragmented reporting streams into one and automated SAP billing reconciliation, cutting month-end prep ~65% and finance reconciliation effort ~70%.",
        },
        {
          name: "Multilingual Call Intelligence (VECV / Volvo Eicher)",
          desc: "A speech-to-NLP pipeline that listens across 6–7 Indian languages: Whisper transcribes, translation normalizes, and an LLM lifts out intent and entities — all on FastAPI, load-tested for 500K+ calls a month. Benchmarked at 83% accuracy on noisy telephony audio (production rollout pending).",
        },
      ],
    },
    {
      role: "Data Scientist Intern",
      company: "RPS Business Solution Pvt. Ltd.",
      period: "Feb 2025 – Jun 2025",
      tags: ["RAG", "Hugging Face", "LoRA", "FAISS"],
      projects: [
        {
          name: "Context-Aware RAG & LoRA Fine-tuning",
          desc: "Shipped an end-to-end RAG app (LangChain + Hugging Face + FAISS) that let the team ask 150+ business documents questions in plain English. Then went deeper — fine-tuning a Llama-2-7B medical assistant with LoRA on proprietary data, lifting held-out answer accuracy from 40% to 55% over the base model.",
        },
      ],
    },
    {
      role: "Independent AI Consultant",
      company: "Freelance — 5+ clients across India & the US (INR 2.7L+ revenue)",
      period: "Sep 2024 – Jun 2025",
      tags: ["LLM", "Embeddings", "WhatsApp Graph API", "RAG", "Whisper"],
      projects: [
        {
          name: "Neural Hire (AI Recruitment)",
          desc: "Built a recruitment platform solo that turns raw docs into publish-ready LinkedIn posts (copy + AI visuals) in seconds instead of ~30 minutes of writing — then shortlists candidates and runs two-way WhatsApp outreach via the Graph API, automating the whole post-to-outreach flow.",
        },
        {
          name: "Frinq (AI Social Matching)",
          desc: "Designed a matching engine that blends LLM relevance scoring with embedding similarity into one tunable score — cutting low-quality suggestions by 67% versus a similarity-only baseline.",
        },
        {
          name: "Call-Insights RAG (US Sales Calls)",
          desc: "Made 200+ diarized US sales calls searchable in plain English — a RAG system (LangChain, Chroma, Whisper, Streamlit) that surfaces insights without scrubbing through recordings.",
        },
      ],
    },
  ],
  projects: [
    {
      id: "xcloom",
      name: "Xcloom",
      subtitle: "AI-Powered Social Media Automation",
      status: "2026 – Present | Personal Project",
      description:
        "One prompt in, a published Instagram post out. My own product: it generates the image, writes the caption, and schedules the whole thing — no manual steps in between.",
      highlights: [
        "Generates publish-ready posts through an 8-stage LangGraph pipeline — context, vision, strategy, prompt, image, caption, and assembly, all chained.",
        "Writes on-brand captions with GPT-4o (tuned for creators, brands, or educators) and paints visuals with DALL·E 3 + GPT-4o Vision style matching.",
        "Runs reliably under load via an MCP tool server and async Celery + FastAPI jobs with retries and fallbacks.",
        "Publishes straight to Instagram through the Graph API, secured with encrypted OAuth and JWT, serving a Flutter app.",
      ],
      stack: [
        "Python",
        "FastAPI",
        "LangGraph",
        "Celery",
        "DALL·E 3",
        "MCP",
        "Instagram Graph API",
        "PostgreSQL",
        "Flutter",
      ],
      featured: true,
      photos: [],
    },
    {
      id: "neural-hire",
      name: "Neural Hire",
      subtitle: "AI Recruitment Platform",
      status: "Freelance",
      description:
        "Hiring, automated end to end — drop in a job doc and it writes the post, shortlists candidates, and reaches out on WhatsApp.",
      highlights: [
        "Turns a raw doc into a publish-ready LinkedIn post in seconds, not ~30 minutes.",
        "Shortlists candidates automatically so recruiters skip the first pass.",
        "Runs two-way candidate outreach over the WhatsApp Graph API.",
      ],
      stack: ["LLMs", "Python", "WhatsApp Graph API"],
      photos: [],
    },
    {
      id: "frinq",
      name: "Frinq",
      subtitle: "AI Social Matching Engine",
      status: "Freelance",
      description:
        "Better social matches by combining what an LLM understands with what embeddings measure — one tunable score instead of similarity alone.",
      highlights: [
        "Fuses LLM relevance with embedding similarity into a single score.",
        "Tunable weighting to dial match quality up or down.",
        "Cut low-quality suggestions by 67% over the baseline.",
      ],
      stack: ["LLMs", "Embeddings", "Vector Search"],
      photos: [],
    },
    {
      id: "call-insights-rag",
      name: "Call-Insights RAG",
      subtitle: "Conversational RAG (US Sales Calls)",
      status: "Freelance",
      description:
        "Ask 200+ US sales calls anything — a RAG system that turns hours of recordings into instant, natural-language answers.",
      highlights: [
        "Diarized and indexed 200+ US sales calls for retrieval.",
        "Answers plain-English questions across every call.",
        "Built with LangChain, Chroma, Whisper, and Streamlit.",
      ],
      stack: ["LangChain", "Chroma", "Whisper", "Streamlit"],
      photos: [],
    },
  ],
  certifications: [
    { name: "Master Program in AI & ML", issuer: "Bignalytics" },
    { name: "Machine Learning: AI, Python", issuer: "Udemy" },
  ],
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Medi-Caps University, Indore",
      period: "Aug 2022 – Jun 2024",
    },
    {
      degree: "Bachelor of Commerce (B.Com)",
      institution: "RPL Maheshwari College (DAVV), Indore",
      period: "Aug 2019 – May 2022",
    },
  ],
  achievements: [
    { value: "~90%", label: "Contract onboarding time cut" },
    { value: "~16×", label: "LLM inference cost cut" },
    { value: "~88%", label: "Invoice field accuracy" },
    { value: "83%", label: "Multilingual ASR accuracy" },
    { value: "500K+", label: "Calls/month capacity" },
    { value: "6–7", label: "Indian languages supported" },
  ],
  testimonials: [],
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ],
};
