export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Oratorio Frassati",
          email: "TUO_INDIRIZZO_VERIFICATO",
        },
        to: [{ email: to }],
        subject,
        textContent: text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Brevo error:", error);
      return Response.json({ ok: false, error }, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ ok: true, data });
  } catch (error) {
    console.error("Send quote error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}