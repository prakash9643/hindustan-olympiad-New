
export const getHtmlOTPTemplate = (otp: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Hindustan Olympiad OTP</title>
    </head>
    <body>
        <h1>Hindustan Olympiad OTP</h1>
        <p>Your OTP is ${otp}. It is valid for 5 minutes.</p>
    </body>
    </html>
    `;
}