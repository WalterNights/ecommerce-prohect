require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 300;

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('DB Conected');
        app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
    } catch (error) {
        console.error("DB Connection failed:", error.message);
        process.exit(1);
    }
})();