import About from "./portfolio/about";
import Achievements from "./portfolio/achievements";
import Certifications from "./portfolio/certifications";
import Contact from "./portfolio/contact";
import EducationSection from "./portfolio/education";
import Experience from "./portfolio/experience";
import Footer from "./portfolio/footer";
import Home from "./portfolio/home";
import Projects from "./portfolio/projects";
import Skills from "./portfolio/skills";
import Testimonials from "./portfolio/testimonials";
import { ContentProvider } from "./portfolio/ui/ContentProvider";
import CustomCursor from "./portfolio/ui/CustomCursor";
import LoadingScreen from "./portfolio/ui/LoadingScreen";
import Navbar from "./portfolio/ui/Navbar";
import NeuralBackground from "./portfolio/ui/NeuralBackground";
import Pagination from "./portfolio/ui/Pagination";
import ScrollProgress from "./portfolio/ui/ScrollProgress";
import SmoothScroll from "./portfolio/ui/SmoothScroll";
import { getContent } from "@/lib/content-store";

// Render on each request so admin edits (stored in Vercel Blob) show immediately.
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();

  return (
    <ContentProvider content={content}>
      <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-accent/30">
        <LoadingScreen />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <Pagination />
        <NeuralBackground />

        <SmoothScroll>
          <main className="relative z-10">
            <Home />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Achievements />
            <Certifications />
            <EducationSection />
            <Testimonials />
            <Contact />
            <Footer />
          </main>
        </SmoothScroll>
      </div>
    </ContentProvider>
  );
}
