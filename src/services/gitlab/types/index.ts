import type { Session } from "next-auth";
import type { GetSessionParams } from "next-auth/react";

export type GetSessionFunction = (
  params?: GetSessionParams
) => Promise<Session | null>;

export type FeatureFlags = {
  name: string;
  description: string;
  active: boolean;
  version: string;
  created_at: string;
  updated_at: string;
  scopes: any[];
  strategies: any[][];
};
