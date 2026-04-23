import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    await resend.emails.send({
      from: "Preventivo Oratorio <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}