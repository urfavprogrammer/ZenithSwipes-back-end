const { Sequelize, DataTypes } = require('sequelize');
(async ()=>{
  const sequelize = new Sequelize(process.env.DB_NAME||'zenith', process.env.DB_USER||'postgres', process.env.DB_PASSWORD||'chief042',{
    host: process.env.DB_HOST||'localhost',
    port: process.env.DB_PORT?Number(process.env.DB_PORT):5433,
    dialect:'postgres',
    logging: console.log
  });
  try{
    await sequelize.authenticate();
    console.log('connected');
    const qi = sequelize.getQueryInterface();
    await qi.createTable('withdrawals', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      withdrawaltype: { type: DataTypes.STRING(100), allowNull: true },
      withdrawalmethod: { type: DataTypes.STRING(100), allowNull: false },
      walletaddress: { type: DataTypes.STRING(100), allowNull: true },
      withdrawaldate: { type: DataTypes.STRING(100), allowNull: false },
      withdrawalstatus: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'pending' },
      withdrawaltransactionid: { type: DataTypes.STRING(100), allowNull: false },
      bankname: { type: DataTypes.STRING(100), allowNull: true },
      accountname: { type: DataTypes.STRING(100), allowNull: true },
      accountnumber: { type: DataTypes.DECIMAL, allowNull: true },
      routingnumber: { type: DataTypes.DECIMAL, allowNull: true },
      swiftcode: { type: DataTypes.STRING(100), allowNull: true },
      paypaladdress: { type: DataTypes.STRING(100), allowNull: true },
      skrilladdress: { type: DataTypes.STRING(100), allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    console.log('created table withdrawals');
    // Insert a SequelizeMeta row to reflect migration applied
    await sequelize.query("INSERT INTO \"SequelizeMeta\" (name) VALUES ('20250821-create-withdrawals.cjs') ON CONFLICT DO NOTHING");
    console.log('ensured SequelizeMeta entry');
    await sequelize.close();
  }catch(e){
    console.error('ERR', e && e.stack?e.stack:e);
    process.exit(1);
  }
})();
