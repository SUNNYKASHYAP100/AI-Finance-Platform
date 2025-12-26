import { seedTransactions } from "@/actions/seed";
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";


const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [

    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        "GO_HTTP", 
      ],
    }),
  ],
});

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}

