export async function POST(req: Request) {
  const body = await req.json();
  console.log("[request]", body);
  // TODO: À brancher sur la vraie DB / CRM (Airtable, Supabase, HubSpot) avant mise en production.
  return Response.json({ success: true, id: crypto.randomUUID() });
}
