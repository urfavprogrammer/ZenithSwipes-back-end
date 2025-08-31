import { Sequelize } from 'sequelize';
import initModels from '../models/index.js';

const sequelize = new Sequelize(process.env.DB_NAME || 'zenith', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'chief042', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5433,
  logging: false
});

(async function(){
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const db = initModels(sequelize);
    const User = db.User;
    const u = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('User findOne result:', u);
  } catch (err) {
  console.error('check_user_find error:', err && err.stack ? err.stack : err);
  if (err && err.parent) console.error('DB parent error:', err.parent);
  if (err && err.original) console.error('DB original error:', err.original && err.original.message ? err.original.message : err.original);
  } finally {
    await sequelize.close();
  }
})();
