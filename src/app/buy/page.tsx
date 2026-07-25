import { redirect } from "next/navigation";
import { getBankrUrl, isLive } from "../../lib/config";

/** Old beginner-guide URL → Bankr (live) or home. */
export default function BuyRedirect() {
  if (isLive()) redirect(getBankrUrl());
  redirect("/");
}
