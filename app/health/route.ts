export function GET() {
  return Response.json(
    { status: 'ok', service: 'mithul-portfolio' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
