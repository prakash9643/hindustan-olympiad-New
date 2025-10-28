import axios from 'axios';
import qs from 'qs';

export const sendOTP = async (phoneNumber: string, otp: string) => {
    const data = qs.stringify({
        sender: 'HNOLYM',
        content: `Use OTP ${otp} to log in to your Hindustan Olympiad account.`,
        apikey: 'G6ZybV4unwe4s3FNM3a8',
        type: 'normal',
        pe_id: '1601100000000000354',
        template_id: '1107175033605239356',
        to: phoneNumber,
        tm_id: '1702158080740553305'
    });

    const config = {
        method: 'post',
        url: 'https://api.meseji.one/sendSMS',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // rethrow so caller can handle it too
    }
};
