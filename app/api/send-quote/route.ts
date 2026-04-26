export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Oratorio Frassati",
          email: "oratoriofrassati@sacrafamigliamonza.it",
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("BREVO ERROR:", data);
      return Response.json({ ok: false, error: data }, { status: res.status });
    }

    return Response.json({ ok: true, data });
  } catch (error) {
    console.error("SEND ERROR:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}