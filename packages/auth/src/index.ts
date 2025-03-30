import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm/sql";
import { z } from "zod";

import { db } from "@plobbo/db/index";
import { Session } from "@plobbo/db/user/session";
import { SessionTable, UserTable } from "@plobbo/db/user/user.sql";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function handler(event: any) {
  const { path, method, body } = event;

  try {
    if (path === "/auth/login" && method === "POST") {
      const { email, password } = loginSchema.parse(JSON.parse(body));

      // TODO: Implement password verification
      const user = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email))
        .limit(1);

      if (!user[0]) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      const token = Auth.generateSessionToken();
      await Auth.createSession(token, user[0].id);

      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    }

    if (path === "/auth/signup" && method === "POST") {
      const { email, password, name } = signupSchema.parse(JSON.parse(body));

      // TODO: Implement password hashing
      const [user] = await db
        .insert(UserTable)
        .values({
          email,
          name,
          verified: false,
        })
        .returning();

      if (!user) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to create user" }),
        };
      }

      const token = Auth.generateSessionToken();
      await Auth.createSession(token, user.id);

      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    }

    if (path === "/auth/me" && method === "GET") {
      const token = event.headers.Authorization?.split(" ")[1];
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      const { user } = await Auth.validateSessionToken(token);
      if (!user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid session" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(user),
      };
    }

    if (path === "/auth/logout" && method === "POST") {
      const token = event.headers.Authorization?.split(" ")[1];
      if (token) {
        const sessionId = encodeHexLowerCase(
          sha256(new TextEncoder().encode(token)),
        );
        await Auth.invalidateSession(sessionId);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Logged out successfully" }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request" }),
    };
  }
}

export namespace Auth {
  export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    } satisfies Session.Model;
    await Session.create(session);

    return session;
  }

  export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const result = (
      await db
        .select({ user: UserTable, session: SessionTable })
        .from(SessionTable)
        .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
        .limit(1)
        .where(eq(SessionTable.id, sessionId))
    )[0];

    if (!result) return { session: null, user: null };
    const { user, session } = result;

    if (Date.now() >= session.expiresAt.getTime()) {
      await Session.remove(session.id);
      return { session: null, user: null };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await Session.update(session.id, { expiresAt: session.expiresAt });
    }

    return { session, user };
  }

  export async function invalidateSession(sessionId: string): Promise<void> {
    await Session.remove(sessionId);
  }

  export async function invalidateAllSessions(userId: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.userId, userId));
  }
}
