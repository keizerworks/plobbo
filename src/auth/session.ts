"use server";

import { cookies } from "next/headers";
import { sha256 } from "@oslojs/crypto/sha2";
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding";

import { SESSION_EXPIRE_TIME, SESSION_EXPIRING_SOON } from "~/constants/auth";
import { Session } from "~/db/session";

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateSessionToken() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export const getCurrentSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
};

export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
    );
    const session = await Session.create({
        id: sessionId,
        userId: userId,
        expiresAt: new Date(Date.now() + SESSION_EXPIRE_TIME),
    });

    if (!session) {
        return;
    }

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: session.expiresAt,
    });

    return session;
}

export const validateSessionToken = async (token: string) => {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
    );
    const result = await Session.findById(sessionId);
    if (typeof result === "undefined") return null;
    const session = result;

    if (Date.now() >= session.expiresAt.getTime()) {
        await Session.remove(sessionId);
        return null;
    }

    if (Date.now() >= session.expiresAt.getTime() - SESSION_EXPIRING_SOON) {
        session.expiresAt = new Date(Date.now() + SESSION_EXPIRE_TIME);
        await Session.update(session.id, { expiresAt: session.expiresAt });
    }

    return session;
};

export const logout = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token) {
        const sessionId = encodeHexLowerCase(
            sha256(new TextEncoder().encode(token)),
        );
        if (sessionId) await Session.remove(sessionId);
    }
    cookieStore.delete("session");
};

export async function invalidateSession(sessionId: string): Promise<void> {
    await Session.remove(sessionId);
}
