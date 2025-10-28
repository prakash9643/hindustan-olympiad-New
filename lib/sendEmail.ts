import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = '813801092417-sgvquljpndnumk1sbh6j5v680oh37jjl.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04sZOW9AEVSNwCgYIARAAGAQSNwF-L9IrFqw983UDBPDRZwUoaQjd8tbDKTVtyi-NJtcLkyEkXfvCG3OrjRmOECvObS2gyjGC8Zw';
const SENDER_EMAIL = 'hindustanolympiad7@gmail.com';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: SENDER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token as string,
            },
        });

        const mailOptions = {
            from: `Hindustan Olympiad <${SENDER_EMAIL}>`,
            to,
            subject,
            text,
            html,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw error;
    }
}