import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Section } from "@/components/ui/Section";

const placeholderProjects = [
  {
    title: "AI Portfolio Assistant",
    description:
      "A conversational interface that helps refine project copy and prepare internship-ready case studies.",
    tags: ["Next.js", "TypeScript", "AI"],
  },
  {
    title: "Settings Platform",
    description:
      "A validated account settings experience with accessible form controls and persistent preferences.",
    tags: ["React Hook Form", "Zod", "Tailwind"],
  },
  {
    title: "Health Monitor",
    description:
      "A server-rendered status page that verifies external API connectivity during deployment checks.",
    tags: ["Server Components", "API", "Vercel"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Placeholder project cards showcasing the layout and reusable UI components for this capstone."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {placeholderProjects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tags={project.tags}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
