import Customers from "~/components/customers";
import Footer from "~/components/footer";
import Header from "~/components/header";
import Hero from "~/components/hero";
import Pricing from "~/components/pricing";
import Why from "~/components/why";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Why />
      <Customers />
      <Pricing />
      <Footer />
    </>
  );
}
