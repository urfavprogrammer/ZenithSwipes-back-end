import UserModel from './User.js';
import AssetModel from './Asset.js';
import DepositModel from './Deposit.js';
import WithdrawalModel from './Withdraw.js';
import StakeModel from './Stake.js';
import Signals from './Signals.js';
import Referral from './Referral.js';
import Admin from './Admin.js';
import Payment from './Payment.js';
import Document from './Document.js';
import { Sequelize } from 'sequelize';


// Synchronous initializer for models. Call this with your Sequelize instance.
export default function initModels(sequelize) {
	const db = {};
	db.User = UserModel(sequelize);
	db.Asset = AssetModel(sequelize);
	db.Deposit = DepositModel(sequelize);
	db.Withdrawal = WithdrawalModel(sequelize);
	db.Stakes = StakeModel(sequelize);
	db.Signals = Signals(sequelize);
	db.Referral = Referral(sequelize);
	db.Admin = Admin(sequelize);
	db.Payment = Payment(sequelize);
	db.Document = Document(sequelize);

	// define associations here
	// The assets table stores a `username` field that corresponds to User.username.
	// Associate using username so Sequelize can eager-load asset via user.asset
	if (db.User && db.Asset) {
		// create a one-to-one relationship where User.username === Asset.username
		// Note: use sourceKey/targetKey because the PK on User is `id` but the linking field is `username`.
		db.User.hasOne(db.Asset, { as: 'asset', foreignKey: 'username', sourceKey: 'username' });
		db.Asset.belongsTo(db.User, { as: 'user', foreignKey: 'username', targetKey: 'username' });
	}

	// Link deposits to users by username (many deposits per user). The `deposits`
	// include used in controllers expects the alias 'deposits'. Use sourceKey/targetKey
	// because the join column is `username` rather than the User primary key `id`.
	// if (db.User && db.Deposit) {
	// 	db.User.hasMany(db.Deposit, { as: 'deposits', foreignKey: 'username', sourceKey: 'username' });
	// 	db.Deposit.belongsTo(db.User, { as: 'user', foreignKey: 'username', targetKey: 'username' });
	// }
	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
	return db;
}
