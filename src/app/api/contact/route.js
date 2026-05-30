import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();
    if (!name || !message) {
      return NextResponse.json({ message: 'Name and message are required' }, { status: 400 });
    }

    // Persist the message (so admin still has it even if email fails).
    let saved = null;
    try {
      saved = await prisma.contactMessage.create({
        data: { name, email: email || null, phone: phone || null, subject: subject || null, message },
      });
    } catch {
      /* table may not exist yet — continue to email anyway */
    }

    const brand = process.env.NEXT_PUBLIC_SITE_NAME || 'Website';
    const when = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const row = (label, value) => value
      ? `<tr>
           <td style="padding:10px 14px;background:#f5f8fb;border:1px solid #e6ebf0;font-weight:600;color:#5b6b7b;width:130px">${escapeHtml(label)}</td>
           <td style="padding:10px 14px;border:1px solid #e6ebf0;color:#0f1722">${escapeHtml(value)}</td>
         </tr>` : '';

    const html = `
      <div style="margin:0;padding:24px;background:#eef6fb;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(20,50,80,.08)">
          <tr>
            <td style="background:linear-gradient(135deg,#34c0eb,#16789e);padding:28px 28px 24px;color:#fff">
              <div style="font-size:13px;letter-spacing:.5px;text-transform:uppercase;opacity:.85">New website enquiry</div>
              <div style="font-size:22px;font-weight:800;margin-top:4px">${escapeHtml(brand)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px">
              <p style="margin:0 0 18px;color:#0f1722;font-size:15px">You have received a new enquiry from <b>${escapeHtml(name)}</b>.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;border-radius:10px;overflow:hidden">
                ${row('Name', name)}
                ${row('Email', email)}
                ${row('Phone', phone)}
                ${row('Subject', subject)}
                ${row('Received', when)}
              </table>
              <div style="margin-top:20px">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#5b6b7b;font-weight:700;margin-bottom:8px">Message</div>
                <div style="background:#f5f8fb;border-left:4px solid #34c0eb;border-radius:8px;padding:14px 16px;color:#0f1722;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>
              </div>
              ${email ? `<div style="margin-top:22px"><a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#34c0eb;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:999px">Reply to ${escapeHtml(name)}</a></div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#0f1722;color:#9fb0bf;font-size:12px;text-align:center">
              Sent automatically from the ${escapeHtml(brand)} contact form.
            </td>
          </tr>
        </table>
      </div>
    `;

    try {
      await sendMail({
        subject: `New enquiry: ${subject || 'Website contact form'}`,
        html,
        replyTo: email || undefined,
      });
    } catch (mailErr) {
      // If email isn't configured yet, still succeed if we saved the message.
      if (!saved) throw mailErr;
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (e) {
    return NextResponse.json({ message: e.message || 'Failed to send message' }, { status: 500 });
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
