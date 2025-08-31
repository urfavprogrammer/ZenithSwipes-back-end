export default function makeListSignals({ Signals }, {}) {
  return async function listSignals(req, res) {
    try {
      const signals = await Signals.findAll();
      return res.json({ success: true, signals });
    } catch (err) {
      console.error('listSignals error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}
