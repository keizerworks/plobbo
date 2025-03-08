import { redirect } from "next/navigation";
import { Resource } from "sst/resource";

import Customers from "~/components/customers";
import Hero from "~/components/hero";
import Pricing from "~/components/pricing";
import Why from "~/components/why";

export default function Home() {
  if (Resource.IsWaitlistMode.value === "true") {
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
