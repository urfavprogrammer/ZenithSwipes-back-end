import { sendMail, renderTemplate } from './mailer.js';

/**
 * utils/emailer.js
 * Convenience wrappers around mailer.sendMail + renderTemplate.
 * - sendTransactionEmail: sends the `transaction` template populated with deposit data
 * - sendTemplate: generic template sender
 * - previewTemplate: render template to HTML string for preview/testing
 */

export async function sendTransactionEmail({ to, username, amount, transactionId, method, status, siteUrl, fromName }) {
  if (!to) throw new Error('Recipient email (to) is required');
  const subject = 'Deposit request received';
  const text = `Hello ${username || ''},\n\nWe received your deposit request of ${amount}. Transaction ID: ${transactionId}. Status: ${status}.\n\nThank you.`;
  const templateData = {
    title: 'Deposit request received',
    username: username || '',
    intro: 'We received your deposit request. Details are below:',
    amount: amount,
    transactionId: transactionId,
    method: method,
    status: status,
    cta: { url: (siteUrl || process.env.SITE_URL || '') + '/account/user/deposits', label: 'View Deposits' },
    fromName: fromName || process.env.FROM_NAME || 'Support Team'
  };

  return sendMail({ to, subject, text, template: 'transaction', templateData });
}

export async function sendTemplate({ to, subject, template, templateData = {}, text = '' }) {
  if (!to) throw new Error('Recipient email (to) is required');
  if (!template) throw new Error('template name is required');
  return sendMail({ to, subject, template, templateData, text });
}

export async function previewTemplate(template, templateData = {}) {
  if (!template) throw new Error('template name is required');
  const html = await renderTemplate(template, templateData);
  return html;
}

export default {
  sendTransactionEmail,
  sendTemplate,
  previewTemplate
};
