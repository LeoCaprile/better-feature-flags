import ky from "ky";
import type { GetSessionFunction } from "./types";

export const gitlab = (getSession: GetSessionFunction) =>
  ky.create({
    prefixUrl: "https://gitlab.com/api/v4",
    hooks: {
      beforeRequest: [
        async (request) => {
          const session = await getSession();

          if (session) {
            request.headers.set(
              "Authorization",
              `Bearer ${session.accessToken}`
            );
          }
        },
      ],
    },
  });
