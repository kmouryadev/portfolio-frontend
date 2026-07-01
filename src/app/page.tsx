import { getSiteConfig } from "@/lib/contentful/site-config";
import Navbar from "./components/Navbar";

export const revalidate = 60;

export default async function Home() {
  const config = await 
    getSiteConfig()

  return (
    <>
      <Navbar config={config} />
    </>
  );
}
