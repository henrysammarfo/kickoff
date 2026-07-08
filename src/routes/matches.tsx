import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout — child routes: /matches (index) and /matches/:matchId */
export const Route = createFileRoute("/matches")({
  component: MatchesLayout,
});

function MatchesLayout() {
  return <Outlet />;
}
