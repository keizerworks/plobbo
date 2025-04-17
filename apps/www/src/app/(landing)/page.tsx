import { redirect } from "next/navigation";

import Customers from "~/components/customers";
import Hero from "~/components/hero";
import Pricing from "~/components/pricing";
import Why from "~/components/why";

export default function Home() {
  //redirec tuser
  if (process.env.IS_WAITLIST_MODE === "true") {
    redirect("/join-waitlist");
  }

  return (
    <>
      <Hero />
      <Why />
      <Customers />
      <Pricing />
    </>
  );
}
