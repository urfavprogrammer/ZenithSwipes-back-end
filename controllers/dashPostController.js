import makeDepositRequest from './dash_handlers/depositrequest.js';
import makeListDeposits from './dash_handlers/listDeposits.js';
import makeWithdrawFunds from './dash_handlers/withdrawFunds.js';
import makeListWithdrawals from './dash_handlers/listWithdrawals.js';
import makeStakeRequest from './dash_handlers/stakeRequest.js';
import makeListStakes from './dash_handlers/listStakes.js';
import makeCreateSignal from './dash_handlers/createSignal.js';
import makeListSignals from './dash_handlers/listSignals.js';
import makeListReferrals from './dash_handlers/listReferrals.js';
import makeCheckOtp from './dash_handlers/withdrawalOtp.js';
import uploadProof from './dash_handlers/uploadProof.js';

export default function createDashPostController(models = {}) {
  const { User, Asset, Deposits, Withdrawal, Stakes, Signals, Referral, Document } = models;

  // Shared utilities used by handlers
  const currentDate = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const useDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  function generateTransactionId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 20;
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
  }

  // Bind handlers
  const depositrequest = makeDepositRequest({ User, Asset, Deposits }, { generateTransactionId, useDate });
  const listDeposits = makeListDeposits({ Deposits }, {});
  const withdrawFunds = makeWithdrawFunds({ User, Asset, Withdrawal }, { generateTransactionId, useDate });
  const listWithdrawals = makeListWithdrawals({ Withdrawal }, {});
  const stakeRequest = makeStakeRequest({ User, Asset, Stakes }, { generateTransactionId, useDate });
  const listStakes = makeListStakes({ Stakes }, {});
  const createSignal = makeCreateSignal({ Asset, Signals }, { generateTransactionId, useDate });
  const listSignals = makeListSignals({ Signals }, {});
  const listReferrals = makeListReferrals({ Referral }, {});
  const checkOtp = makeCheckOtp({ User, Withdrawal }, {});
  const uploadDocument = uploadProof({ User, Document, Deposits }, {});

  return {
    depositrequest,
    listDeposits,
    withdrawFunds,
    listWithdrawals,
    stakeRequest,
    listStakes,
    createSignal,
    listSignals,
    listReferrals,
    checkOtp,
    uploadDocument
  };
}
