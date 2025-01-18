import { UpdateUserProfile } from "components/organizationMember/update";
import { api } from "trpc/server";

export default async function Page() {
  const member = await api.organizationmember.get();
  return <UpdateUserProfile data={member} />;
}
