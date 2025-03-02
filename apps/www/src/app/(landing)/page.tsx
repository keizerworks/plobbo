import Customers from "~/components/customers";
import Hero from "~/components/hero";
import Pricing from "~/components/pricing";
import Why from "~/components/why";

export default function Home() {
  return (
    <>
      <Hero />
      <Why />
      <Customers />
      <Pricing />
    </>
  );
}
