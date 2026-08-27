import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { safetyAdvisories } from "../../db/schema.js";

function isAuthorized(req: Request): boolean {
  const providedKey = req.headers.get("x-admin-key") || "";
  const expectedKey = Netlify.env.get("ADMIN_API_KEY") || "";
  return Boolean(expectedKey) && providedKey === expectedKey;
}

async function listAdvisories() {
  return db
    .select()
    .from(safetyAdvisories)
    .orderBy(desc(safetyAdvisories.time));
}

export default async (req: Request) => {
  if (req.method === "GET") {
    return Response.json(await listAdvisories());
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { message, severity } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response("Message is required", { status: 400 });
    }

    await db.insert(safetyAdvisories).values({
      message: message.trim(),
      severity: typeof severity === "string" && severity ? severity : "MEDIUM",
    });

    return Response.json(await listAdvisories());
  }

  if (req.method === "DELETE") {
    if (!isAuthorized(req)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    await db.delete(safetyAdvisories).where(eq(safetyAdvisories.id, id));

    return Response.json(await listAdvisories());
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/advisories",
};
