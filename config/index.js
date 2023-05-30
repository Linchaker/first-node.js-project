require('dotenv').config();

module.exports = {
    MONGO_CONNECT: process.env.MONGO_CONNECT ?? '',
    HOST: process.env.HOST ?? "localhost",
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,

    SESSION_SECRET: 'some secret value',

    // email
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.MAIL_FROM_ADDRESS,
    EMAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
}