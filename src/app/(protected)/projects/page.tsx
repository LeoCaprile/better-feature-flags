import { auth } from "@/app/auth";
import Projects from "@/components/modules/Projects";
import { fetchProjects } from "@/services/gitlab/projects";

export default async function ProjectsPage() {
  const projects = await fetchProjects(auth)({
    queryKey: ["", { membership: true }],
  });

  return <Projects projectsInitialData={projects as unknown[]}></Projects>;
}
