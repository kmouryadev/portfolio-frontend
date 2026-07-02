import { getAllProjects } from '@/lib/contentful/projects';
import { getSiteConfig }  from '@/lib/contentful/site-config';
import Navbar         from '../components/Navbar';
import ChatWidget     from '../components/ChatWidget';
import ProjectsClient from './ProjectsClient';

export const revalidate = 60;

export default async function ProjectsPage() {
  const [config, projects] = await Promise.all([
    getSiteConfig(),
    getAllProjects(),
  ]);

  return (
    <>
      <Navbar config={config} />
      <main className="pt-20 min-h-screen">
        <ProjectsClient projects={projects} />
      </main>
      <ChatWidget />
    </>
  );
}
