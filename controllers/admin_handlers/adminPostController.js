import approveDepositRequest from "./adminPostHandlers/approvedeposit.js";
import declineDepositRequest from "./adminPostHandlers/declinedeposit.js";
import deleteDepositRequest from "./adminPostHandlers/deleteDeposit.js";
import approveWithdrawRequest from "./adminPostHandlers/approvewithdraw.js";
import declineWithdrawRequest from "./adminPostHandlers/declineWithdrawal.js";
import deleteWithdrawalRequest from "./adminPostHandlers/deleteWithdrawalRequest.js";
import updateUser from "./adminPostHandlers/userUpdate.js";
import updatePayment from "./adminPostHandlers/updatePayment.js";


export default function createAdminPostController(models = {}) {
    const { User, Deposits, Withdrawal, Asset, Referral, Admin, Payment  } = models || {};

    //Bind approve handlers
    const approvedepositrequest = approveDepositRequest({ Deposits, Asset });    
    const declinedepositrequest = declineDepositRequest({ Deposits });
    const deletedepositrequest = deleteDepositRequest({ Deposits });

    //Bind withdraw handlers
    const approvewithdrawrequest = approveWithdrawRequest({ Withdrawal, Asset });
    const declinewithdrawrequest = declineWithdrawRequest({ Withdrawal, Asset });
    const deletewithdrawrequest = deleteWithdrawalRequest({ Withdrawal });

    //Bind updateUser
    const updateuser = updateUser({ User, Asset });

    //Bind updatePayment
    const updatepayment = updatePayment({ Payment, Asset });

    return {
        approvedepositrequest,
        approvewithdrawrequest,
        declinewithdrawrequest,
        declinedepositrequest,
        deletedepositrequest,
        deletewithdrawrequest,
        updateuser,
        updatepayment
    };

}