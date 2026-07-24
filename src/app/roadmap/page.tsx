import { redirect } from "next/navigation";

/** Old internal roadmap URL → consumer status section. */
export default function RoadmapRedirect() {
  redirect("/#whats-next");
}
