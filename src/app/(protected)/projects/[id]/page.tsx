import { auth } from "@/app/auth";
import FeatureFlagBoard from "@/components/modules/Board/FeatureFlagBoard";

import { fetchProjectFeatureFlags } from "@/services/gitlab/projects";
import type { FeatureFlags } from "@/services/gitlab/types";
import { nanoid } from "nanoid";

export default async function Project({ params }: { params: { id: string } }) {
  const featureFlags = await fetchProjectFeatureFlags<FeatureFlags[]>(
    params.id
  )(auth)({ queryKey: ["", { per_page: 100 }] });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Feature Flags</h1>
      <FeatureFlagBoard
        initialBoardData={{
          id: nanoid(),
          name: "Backlog",
          flags: featureFlags,
          canDelete: false,
        }}
      />
    </div>
  );
}
