import { connection } from "next/server";

export default async function Page() {
  await connection();
  return <p className="m-4">Dashboard</p>;
}
