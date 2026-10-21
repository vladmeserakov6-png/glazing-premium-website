import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { Services } from "@/components/home/services";
import { Approach } from "@/components/home/approach";
import { Inspiration } from "@/components/home/inspiration";
import { Faq } from "@/components/home/faq";
import { ProjectCta } from "@/components/home/project-cta";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Benefits />
      <Services />
      <Approach />
      <Inspiration />
      <Faq />
      <ProjectCta />
    </main>
  );
}
