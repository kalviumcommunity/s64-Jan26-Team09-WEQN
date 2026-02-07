import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { sendEmailSchema } from '@/lib/validators/email';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = sendEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { to, subject, html } = parsed.data;
    const result = await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true, data: { messageId: result.messageId } });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
