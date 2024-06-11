import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { ServiceFactory } from "@/services/utils";

export function useProjects(params?: { initialData?: any[]; search: string }) {
  return useQuery({
    queryKey: ["projects", { search: params?.search ?? "", membership: true }],
    queryFn: fetchProjects(getSession),
    initialData: params?.initialData,
  });
}

export const fetchProjects = ServiceFactory("projects");

export const fetchProjectFeatureFlags = <T>(id: string) =>
  ServiceFactory<T>(`projects/${id}/feature_flags`);
