import { UpdateOrgMemberProfile } from "components/organization-member/update";
import { api } from "trpc/server";

export default async function Page() {
  const member = await api.organization.member.get();
  console.log(member);
  return <UpdateOrgMemberProfile data={member} />;
}
