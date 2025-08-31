export default function updatePaymentDetails() {
    return async function updatePaymentDetails(req, res) {
        try {
            const { BTC, ETH, USDT, LTC, TRX, DOGE, XRP } = req.body;
            const Payment = req.app.get('models').Payment;

            // console.log(ETH);
            // Validate and sanitize input
            const paymentData = {
                BTC: BTC || null,
                ETH: ETH || null,
                USDT: USDT || null,
                LTC: LTC || null,
                TRX: TRX || null,
                DOGE: DOGE || null,
                XRP: XRP || null
            };

            // let paymentChanged = false;

            console.log(paymentData);
            const paymentFields = ['BTC', 'ETH', 'USDT', 'LTC', 'TRX', 'DOGE', 'XRP'];
            
            // Get the first (and only) payment row, or create if none exists
            let payment = await Payment.findOne();
            if (!payment) {
                // No row exists, create new
                payment = await Payment.create({ BTC, ETH, USDT, LTC, TRX, DOGE, XRP });
            } else {
                let updatedFields = {};
                for (const field of paymentFields) {
                    const key = field.toLowerCase();
                    if (payment[key] !== paymentData[field] && paymentData[field] !== null && paymentData[field] !== undefined && paymentData[field] !== "") {
                        updatedFields[key] = paymentData[field];
                    }
                }
                if (Object.keys(updatedFields).length > 0) {
                    await payment.update(updatedFields);
                }
            }
            res.redirect('/admin/payment');
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).send('Internal Server Error');
        }
    };
}