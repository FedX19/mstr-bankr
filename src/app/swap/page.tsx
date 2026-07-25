import { redirect } from "next/navigation";
import { getBankrUrl, isLive } from "../../lib/config";

/** Old swap embed URL → Bankr (live) or home. */
export default function SwapRedirect() {
  if (isLive()) redirect(getBankrUrl());
  redirect("/");
}
