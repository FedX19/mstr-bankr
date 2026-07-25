import { redirect } from "next/navigation";

/** Legacy URL → mission / terminal */
export default function RoadmapRedirect() {
  redirect("/terminal");
}
