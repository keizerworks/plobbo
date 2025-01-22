"use server";

import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { getCurrentSession } from "auth/session";
import { env } from "env";
import { getSignedUrlPutObject } from "storage";

export const getPreSignedUrlPutObject = async (
  name: string,
  bucket: string,
) => {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/signin");
  }

  const filename = `${createId()}-${name}`;
  const url = encodeURI(env.NEXT_PUBLIC_MINIO_URL + `${bucket}/${filename}`);
  const uploadUrl = await getSignedUrlPutObject({
    bucket,
    filename,
  });

  return {
    url,
    uploadUrl,
    filename,
  };
};
