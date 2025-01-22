import { connection } from "next/server";
import { UpdateOrgMemberProfile } from "components/organization-member/update";
import { api } from "trpc/server";

export default async function Page() {
  await connection();
  const member = await api.organization.member.get();

  return <UpdateOrgMemberProfile data={member} />;
}
