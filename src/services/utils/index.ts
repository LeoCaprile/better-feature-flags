import { signOut } from "@/app/auth";
import { gitlab } from "../gitlab";
import type { GetSessionFunction } from "../gitlab/types";
import { redirect } from "next/navigation";

export function ServiceFactory<T>(endpoint: string) {
  return (getSession: GetSessionFunction) =>
    async function (params?: {
      queryKey: [
        string,
        searchParams: Record<string, string | number | boolean>
      ];
    }) {
      if (endpoint) {
        const [_key, searchParams] = params?.queryKey ?? ["", {}];
        const data = await gitlab(getSession)
          .get(endpoint, {
            searchParams,
          })
          .json<T>();
        return data;
      } else {
        throw new Error("Need to define endpoint string on query");
      }
    };
}
