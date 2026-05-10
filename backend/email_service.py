"""
Email service for Blayake — uses Resend to send lead notifications.

Behaviour:
  • If RESEND_API_KEY is blank, all sends are no-ops (the form still works,
    we just log a warning).
  • Sends are designed to be invoked from FastAPI BackgroundTasks so the
    HTTP request returns fast even if Resend is slow.
  • Auto-reply to the lead is gated by RESEND_AUTOREPLY_ENABLED because
    Resend's test mode only allows sending to verified addresses.
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime
from typing import Optional

import resend


logger: logging.Logger = logging.getLogger(__name__)

# Module-level config, captured at import time
RESEND_API_KEY: str = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL: str = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip()
LEAD_NOTIFY_EMAIL: str = os.environ.get(
    "LEAD_NOTIFY_EMAIL", "teamblayake.agency@gmail.com"
).strip()
AUTOREPLY_ENABLED: bool = os.environ.get("RESEND_AUTOREPLY_ENABLED", "false").strip().lower() == "true"

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def _esc(value: Optional[str]) -> str:
    """Minimal HTML-escape for user-supplied strings going into the email body."""
    if value is None or value == "":
        return "—"
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


def _build_notification_html(
    name: str,
    email: str,
    phone: Optional[str],
    message: Optional[str],
    created_at: datetime,
) -> str:
    """Internal notification email — sent to the studio inbox."""
    safe = {
        "name": _esc(name),
        "email": _esc(email),
        "phone": _esc(phone),
        "message": _esc(message),
        "ts": created_at.strftime("%b %d, %Y · %H:%M UTC"),
    }
    reply_subject = "Re: your message to Blayake"
    reply_href = f"mailto:{email}?subject={reply_subject}"

    return f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 28px 0 28px;">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.32em;color:#888;text-transform:uppercase;">/ NEW LEAD</div>
          <h1 style="margin:14px 0 6px 0;font-size:28px;line-height:1.1;color:#ffffff;font-weight:900;letter-spacing:-0.02em;">
            Someone just booked you.
          </h1>
          <div style="font-size:14px;color:#999;line-height:1.5;">{safe['ts']}</div>
        </td></tr>
        <tr><td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:12px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid #1a1a1a;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#777;text-transform:uppercase;">Name</div>
              <div style="font-size:16px;color:#fff;margin-top:4px;font-weight:600;">{safe['name']}</div>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #1a1a1a;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#777;text-transform:uppercase;">Email</div>
              <div style="font-size:16px;color:#fff;margin-top:4px;">
                <a href="mailto:{safe['email']}" style="color:#ffffff;text-decoration:underline;">{safe['email']}</a>
              </div>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #1a1a1a;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#777;text-transform:uppercase;">Phone</div>
              <div style="font-size:16px;color:#fff;margin-top:4px;">{safe['phone']}</div>
            </td></tr>
            <tr><td style="padding:14px 18px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#777;text-transform:uppercase;">Message</div>
              <div style="font-size:15px;color:#dadada;margin-top:6px;line-height:1.55;white-space:pre-wrap;">{safe['message']}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 28px 28px;">
          <a href="{reply_href}"
             style="display:inline-block;background:#ffffff;color:#050505;text-decoration:none;font-weight:700;font-size:14px;padding:13px 22px;border-radius:999px;letter-spacing:-0.01em;">
            Reply to {safe['name']} →
          </a>
        </td></tr>
        <tr><td style="padding:18px 28px 28px 28px;border-top:1px solid #1a1a1a;">
          <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#666;text-transform:uppercase;">
            Blayake · AI Systems Agency · Lead capture
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""".strip()


def _build_autoreply_html(name: str) -> str:
    """Confirmation email back to the lead."""
    safe_name = _esc(name)
    return f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px;">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.32em;color:#888;text-transform:uppercase;">/ Blayake</div>
          <h1 style="margin:14px 0 14px 0;font-size:28px;line-height:1.15;color:#fff;font-weight:900;letter-spacing:-0.02em;">
            Thanks, {safe_name}.<br/>We've got it.
          </h1>
          <p style="font-size:15px;color:#bdbdbd;line-height:1.6;margin:0 0 14px 0;">
            A real human (not a queue) will read your message and reply within 24 hours
            — usually with a 1-page diagnosis, no slide deck, no funnel.
          </p>
          <p style="font-size:15px;color:#bdbdbd;line-height:1.6;margin:0 0 24px 0;">
            If it's urgent, just reply to this email. We're small and we read it all.
          </p>
          <a href="https://x.com/blayake"
             style="display:inline-block;background:#ffffff;color:#050505;text-decoration:none;font-weight:700;font-size:14px;padding:13px 22px;border-radius:999px;">
            Follow @blayake on X →
          </a>
        </td></tr>
        <tr><td style="padding:18px 28px 28px 28px;border-top:1px solid #1a1a1a;">
          <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;color:#666;text-transform:uppercase;">
            Blayake · AI Systems Agency · teamblayake.agency@gmail.com
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""".strip()


async def _send(params: dict) -> None:
    """Run the synchronous Resend SDK call in a worker thread."""
    if not RESEND_API_KEY:
        logger.warning("Resend skipped (RESEND_API_KEY not set): to=%s subject=%r", params.get("to"), params.get("subject"))
        return
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Resend sent id=%s to=%s", result.get("id"), params.get("to"))
    except Exception:
        logger.exception("Resend send failed for to=%s", params.get("to"))


async def send_lead_notification(
    name: str,
    email: str,
    phone: Optional[str],
    message: Optional[str],
    created_at: datetime,
) -> None:
    """Notify the studio inbox AND optionally auto-reply to the lead."""
    notify_html = _build_notification_html(name, email, phone, message, created_at)
    await _send(
        {
            "from": f"Blayake Leads <{SENDER_EMAIL}>",
            "to": [LEAD_NOTIFY_EMAIL],
            "reply_to": email,
            "subject": f"New lead — {name}",
            "html": notify_html,
        }
    )

    if AUTOREPLY_ENABLED:
        await _send(
            {
                "from": f"Blayake <{SENDER_EMAIL}>",
                "to": [email],
                "subject": "We got your message — Blayake",
                "html": _build_autoreply_html(name),
            }
        )
    else:
        logger.info("Auto-reply skipped (RESEND_AUTOREPLY_ENABLED=false) for %s", email)
