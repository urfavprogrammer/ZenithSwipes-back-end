// Lightweight mailer utility: tries to use nodemailer if available and SMTP env is configured.
// sendMail accepts an object: { to, subject, text, html }
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import ejs from 'ejs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderTemplate(templateName, data = {}) {
  try {
    const tplPath = `${__dirname}/../views/email_templates/${templateName}.ejs`;
    const content = await fs.readFile(tplPath, 'utf8');
    return ejs.render(content, data);
  } catch (err) {
    console.warn('renderTemplate failed:', err && err.stack ? err.stack : err);
    return null;
  }
}

export async function sendMail({ to, subject, text, html, template, templateData = {} }) {
  if (!to) {
    console.warn('sendMail called without recipient');
    return null;
  }
  // If a template is provided, render HTML from it (if html not already provided)
  try {
    if (template) {
      const rendered = await renderTemplate(template, templateData);
      if (rendered && !html) html = rendered;
    }

    const nodemailer = await import('nodemailer');
    const transportOptions = {
      host: process.env.SMTP_HOST || undefined,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
    };
    if (process.env.SMTP_USER) {
      transportOptions.auth = { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
    }

    const transporter = nodemailer.createTransport(transportOptions);
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com';

    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log('Mailer: sent message id=', info && info.messageId ? info.messageId : info);
    return info;
  } catch (err) {
    // nodemailer not installed or SMTP misconfigured - log and continue
    console.warn('Mailer: failed to send mail (nodemailer/SMTP not available or error):', err && err.stack ? err.stack : err);
    return null;
  }
}

export default { sendMail };
