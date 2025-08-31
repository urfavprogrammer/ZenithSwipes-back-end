#!/usr/bin/env node
// Simple CLI to send or preview an email template.
import { argv } from 'process';
import { previewTemplate, sendTemplate, sendTransactionEmail } from '../utils/emailer.js';

async function main() {
  const cmd = argv[2] || 'preview';

  if (cmd === 'preview') {
    const html = await previewTemplate('transaction', {
      title: 'Test Transaction',
      username: 'Test User',
      intro: 'This is a preview of the transaction template.',
      amount: '$123.45',
      transactionId: 'TX-EXAMPLE',
      method: 'Card',
      status: 'pending',
      cta: { url: 'https://example.com', label: 'View' },
      fromName: 'Dev'
    });
    console.log(html);
    process.exit(0);
  }

  if (cmd === 'send-transaction') {
    const to = argv[3];
    if (!to) {
      console.error('Usage: send-transaction <recipient_email>');
      process.exit(2);
    }
    await sendTransactionEmail({ to, username: 'Test User', amount: '$100', transactionId: 'TX123', method: 'Bank', status: 'pending' });
    console.log('Sent (or attempted)');
    process.exit(0);
  }

  if (cmd === 'send-template') {
    const to = argv[3];
    const template = argv[4] || 'transaction';
    if (!to) {
      console.error('Usage: send-template <recipient_email> [template]');
      process.exit(2);
    }
    await sendTemplate({ to, subject: 'Test', template, templateData: { title: 'Hi', username: 'Test' } });
    console.log('Sent (or attempted)');
    process.exit(0);
  }

  console.error('Unknown command:', cmd);
  process.exit(1);
}

main().catch(err => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
