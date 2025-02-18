"use server";

import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";

import { getCurrentSession } from "~/auth/session";
import { env } from "~/env";
import { getSignedUrlPutObject } from "~/storage";

export const getPreSignedUrlPutObject = async (name: string) => {
    const session = await getCurrentSession();
    if (!session?.user) {
        redirect("/signin");
    }

    const filename = encodeURI(`${createId()}-${name}`);
    const url = env.NEXT_PUBLIC_S3_DOMAIN + `/${filename}`;

    const uploadUrl = await getSignedUrlPutObject({
        filename,
    });

    return {
        url,
        uploadUrl,
        filename,
    };
};
