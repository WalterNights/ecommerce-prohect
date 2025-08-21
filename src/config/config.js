require('dotenv').config();

const common = {
  username: process.env.DB_USER,
  passowrd: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT): undefined,
  dialect: "postgres",
  loggin: false,
  define: { underscored: true}
};

module.exports = {
  developmet: common,
  test: { ...common, database: (process.env.DB_NAME || 'ecommerce_db') + '_test' },
  production: common
};