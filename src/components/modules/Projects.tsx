"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/services/gitlab/projects";
import { BookIcon } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function Projects({
  projectsInitialData,
}: {
  projectsInitialData: unknown[];
}) {
  const [search, setSearch] = useState("");
  const { data: projects, isLoading } = useProjects({
    search,
    initialData: projectsInitialData,
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <Input onChange={handleOnChange} />

      {isLoading ? (
        <div className="flex flex-col gap-5 mt-10">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-5 mt-10">
            {Array.isArray(projects) &&
              projects.map((project) => (
                <li key={project.id}>
                  <Link href={`projects/${project.id}`}>
                    <Alert>
                      <BookIcon />
                      <AlertTitle>{project.name}</AlertTitle>
                      <AlertDescription>{project.id}</AlertDescription>
                    </Alert>
                  </Link>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
