import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ThemeProvider, { themeInitScript } from "./portfolio/ui/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utkarsh Verma — AI/ML Engineer | Applied GenAI & LLM Systems",
  description:
    "Portfolio of Utkarsh Verma, an Applied GenAI & LLM-systems engineer building production RAG architectures, document intelligence, and multilingual speech-to-NLP pipelines.",
  keywords: [
    "Utkarsh Verma",
    "AI/ML Engineer",
    "GenAI",
    "LLM",
    "RAG",
    "LangChain",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Utkarsh Verma" }],
  openGraph: {
    title: "Utkarsh Verma — AI/ML Engineer",
    description:
      "Applied GenAI & LLM-systems engineer. RAG, document intelligence, and multilingual speech-to-NLP.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
