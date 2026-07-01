import { getSiteConfig } from "@/lib/contentful/site-config";
import { getExperience } from "@/lib/contentful/experience";
import { getFeaturedProjects } from "@/lib/contentful/projects";
import { getSkillGroups } from "@/lib/contentful/skills";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SelectedWork from "./components/SelectedWork";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import ChatWidget from "./components/ChatWidget";

export const revalidate = 60;

export default async function Home() {
  const [config, experience, featuredProjects, skillGroups] = await Promise.all(
    [getSiteConfig(), getExperience(), getFeaturedProjects(), getSkillGroups()],
  );

  return (
    <>
      <Navbar config={config} />
      <main>
        <Hero config={config} skillGroups={skillGroups} />
        <About config={config} />
        <SelectedWork projects={featuredProjects} />
        <Skills skillGroups={skillGroups} />
        <Experience experience={experience} />
        <Contact config={config} />
      </main>
      <ChatWidget/>
    </>
  );
}
