import arcjet, { detectBot, shield } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { seedTransactions } from "@/actions/seed";

// 🔐 Arcjet config (API routes ke liye SAFE)
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

export async function GET(req) {
  // 🛡 Arcjet protection
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new Response("Blocked by Arcjet", { status: 403 });
  }

  // 🔑 Clerk auth
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 🌱 Your existing logic
  const result = await seedTransactions();
  return Response.json(result);
}
