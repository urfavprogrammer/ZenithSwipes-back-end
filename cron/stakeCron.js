
import cron from 'node-cron';
import initModels from '../models/index.js';
import { Sequelize, Op } from 'sequelize';

// Setup sequelize instance (adjust config as needed)
const sequelize = new Sequelize({
  dialect: 'sqlite', // or 'mysql', 'postgres', etc.
  storage: './database.sqlite', // adjust for your setup
});

const db = initModels(sequelize);
const Stake = db.Stakes;
const Asset = db.Asset;

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Only process active stakes (add a column 'active' or use expiration logic)
    const today = new Date();
    const stakes = await Stake.findAll({
      where: {
        // Example: active stakes have not expired
        stakeduration: { [Op.gt]: 0 },
        // You can add more conditions, e.g. active: true
      }
    });
    for (const stake of stakes) {
      // Calculate expiration
      const stakeDate = new Date(stake.stakedate);
      const daysStaked = Math.floor((today - stakeDate) / (1000 * 60 * 60 * 24));
      const expired = daysStaked >= stake.stakeduration;
      if (expired) {
        // Mark stake as expired (add a column or set stakeduration = 0)
        stake.stakeduration = 0;
        // Optionally, set a status column: stake.status = 'expired';
        await stake.save();
        console.log(`Stake ${stake.stakeid} expired for ${stake.username}`);
        continue;
      }
      // Calculate daily profit
      const apy = Number(stake.est_apy);
      const amount = Number(stake.amount);
      const dailyProfit = (apy / 100 / 365) * amount;
      // Update profits (add a column 'profit' to Stake if needed)
      stake.profit = (stake.profit || 0) + dailyProfit;
      await stake.save();
      // Update user's total balance
      const asset = await Asset.findOne({ where: { username: stake.username } });
      if (asset) {
        asset.total_balance = Number(asset.total_balance) + dailyProfit;
        await asset.save();
        console.log(`Credited ${dailyProfit} to ${stake.username}'s total balance.`);
      }
      console.log(`Stake ${stake.stakeid} for ${stake.username}: Credited daily profit ${dailyProfit}`);
    }
    console.log('Stake automation completed.');
  } catch (err) {
    console.error('Stake cron error:', err);
  }
});

console.log('Stake cron job scheduled.');
