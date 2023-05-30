require('dotenv').config();

module.exports = {
    MONGO_CONNECT: process.env.MONGO_CONNECT ?? '',
    HOST: process.env.HOST ?? "localhost",
    PORT: process.env.PORT,
    SESSION_SECRET: 'some secret value',
}