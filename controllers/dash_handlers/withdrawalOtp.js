export default function makeCheckOtp({ User, Withdrawal }, { }) {
  return async function checkOtp(req, res) {
    try {
      let usernameValue = null;
      if (req.session && req.session.username) usernameValue = String(req.session.username).toLowerCase();
      else if (req.session && req.session.userId) {
        const sessionUser = await (req.app.get('models').User).findByPk(req.session.userId, { attributes: ['username'] }).catch(() => null);
        if (sessionUser && sessionUser.username) usernameValue = String(sessionUser.username).toLowerCase();
      }
      if (!usernameValue) return res.status(401).json({ success: false, message: 'Not authenticated' });
      // Scope to the logged-in user's deposits and use valid column names

      // console.log('Username from session:', usernameValue);
    
        const { otp } = req.body;
       


    // const { username, otp } = JSON.parse(req.body);

    // console.log('Received OTP verification request for username:', username);
    // // Validate user and OTP
    // const user = await User.findOne({ where: { username } });
    // if (!user) return res.status(404).json({ error: 'User not found' });

    const withdraw = await User.findOne({ where: { username: usernameValue} });
        const userOtp = withdraw.withdrawalOtp;

        if(otp == userOtp) {
            // OTP is valid
            // Proceed with the withdrawal process or any other action
            return res.status(200).json({ success: "OTP verified successfully" });

        } else if (userOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        } 
    


   
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }; 
}
};
