import { Sequelize } from 'sequelize';

async function run() {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  try {
    const modelsModule = await import('../models/index.js');
    const initModels = modelsModule.default || modelsModule.initModels || modelsModule;
    const db = initModels(sequelize);
    console.log('Models initialized:', Object.keys(db).join(', '));
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Model init error:', err && err.stack ? err.stack : err);
    process.exit(2);
  }
}
run();
