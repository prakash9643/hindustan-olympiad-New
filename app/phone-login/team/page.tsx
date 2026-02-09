'use client';

import { useEffect, useRef, useState } from 'react';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth, RecaptchaVerifier } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function PhoneLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [mobile, setMobile] = useState('');
    const { success, error } = useToast();
    const [disableSendOtp, setDisableSendOtp] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user && user !== "undefined" && user !== null) {
            if (localStorage.getItem("type") === "team-member") {
                router.push("/team");
            }
        } else {
        }
    }, []);

    const startTimer = () => {
        setTimeLeft(60);
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        if(timeLeft === 0) {
            setDisableSendOtp(false);
        }
    };


    const setupRecaptcha = () => {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (response: any) => {
                console.log('Recaptcha resolved');
            },
        });
    };

    useEffect(() => {
        setupRecaptcha();

    }, []);

    const sendOTP = async (e: any) => {
        e.preventDefault();
        setDisableSendOtp(true);
        setLoading(true);
        const appVerifier = (window as any).recaptchaVerifier;
        try {
            // const confirmation = await signInWithPhoneNumber(auth, "+91" + mobile, appVerifier);
            // setConfirmationResult(confirmation);
            // alert('OTP sent!');
            // startTimer();

            const confirmation = await fetch("/api/phone-login/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: mobile,
                    type: "team-member",
                }),
            });

            const data = await confirmation.json();
            if (data.error) {
                error(data.error, { duration: 3000, position: "top-right", description: "Please enter the OTP sent to your mobile number." });
            } else {
                success('OTP sent!', { duration: 3000, position: "top-right", description: "Please enter the OTP sent to your mobile number." });
                startTimer();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if(mobile.length === 10) {
            setDisableSendOtp(false);
        }
    }, [mobile]);

    const verifyOTP = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            // const result = await confirmationResult.confirm(otp.join(''));
            // const user = result.user;
            // console.log('User is verified:', user);
            // alert('OTP verified!');

            const verification = await fetch("/api/phone-login/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: mobile,
                    otp: otp.join(''),
                    type: "team-member",
                }),
            });
            const data = await verification.json();
            if (data.error) {
                error("Inncorrect OTP", { duration: 3000, position: "top-right", description: "Incorrect OTP. Please try again." });
            } else {
                success('OTP verified!', { duration: 3000, position: "top-right", description: "OTP verified successfully." });
                console.log(data);
                console.log(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("type", "team-member");
                router.push("/team/view-schools");
            }
        } catch (error) {
            console.error('Incorrect OTP');
            alert('Incorrect OTP!');
        }
        setLoading(false);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);

            // Focus the last input
            inputRefs.current[5]?.focus();
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Allow only one digit
        if (!/^\d*$/.test(value)) return;

        // Update the OTP array
        const newOtp = [...otp];
        newOtp[index] = value.substring(0, 1);
        setOtp(newOtp);

        // Auto-focus next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current input is empty and backspace is pressed, focus previous input
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleResendOtp = async () => {
        setTimeLeft(30);
        setOtp(Array(6).fill(''));
        setLoading(true);
        const appVerifier = (window as any).recaptchaVerifier;
        try {
            const confirmation = await signInWithPhoneNumber(auth, "+91" + mobile, appVerifier);
            setConfirmationResult(confirmation);
            alert('OTP sent!');
            startTimer();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container flex h-screen w-full flex-col items-center justify-center px-4 mx-auto">
            <div id="recaptcha-container" />
            <Card className='max-w-sm w-full'>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your mobile number</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={sendOTP} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number (10 Digits)</Label>
                            <div className="relative">
                                <Input
                                    name="mobile"
                                    id="mobile"
                                    type="tel"
                                    placeholder="9XXXXXXXXX"
                                    required
                                    pattern="[0-9]{10}"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="pr-[100px]"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || disableSendOtp || !mobile || mobile.length !== 10 || !/^\d+$/.test(mobile)}
                                    className={`absolute right-0 top-0 h-full rounded-l-none transition-all duration-200 ease-in-out hover:bg-transparent bg-transparent ${loading || loading || !mobile || mobile.length !== 10 || !/^\d+$/.test(mobile) ? "text-primary/80 cursor-not-allowed" : "text-primary hover:text-primary/80 active:text-primary/90"}`}
                                    variant="secondary"
                                >
                                    {loading ? "..." : "Send OTP"}
                                </Button>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={verifyOTP} className="space-y-8">
                        <div>
                            <div className="flex justify-between gap-2 mb-2">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="w-full">
                                        <input
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={otp[index] || ''}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className={`w-full aspect-square text-center text-xl font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                            autoComplete="one-time-code"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                disabled={loading || otp.join('').length !== 6}
                                className={`w-full flex items-center justify-center rounded-lg py-3 px-4 font-medium text-white 
            ${loading || otp.join('').length !== 6
                                        ? 'bg-primary/80 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/80 active:bg-primary/90'
                                    } transition-all duration-200`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>Verify</span>
                                        <ChevronRight className="ml-1 h-5 w-5" />
                                    </div>
                                )}
                            </Button>

                            <div className="text-center">
                                {timeLeft > 0 ? (
                                    <p className="text-gray-500 text-sm">Resend OTP in <span className="font-medium">{timeLeft}s</span></p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-[0.8rem] text-muted-foreground">
                        Write to us at <Link className='text-primary' target='_blank' href="mailto: olympiadsupport@livehindustan.com">olympiadsupport@livehindustan.com</Link> if you&apos;re facing issues logging in.
                    </p>
                </CardFooter>
            </Card>
        </div>

        // <div className="container flex h-screen w-screen flex-col items-center justify-center mt-28">
        //   <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
        //   <button onClick={sendOTP}>Send OTP</button>

        //   <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
        //   <button onClick={verifyOTP}>Verify OTP</button>

        //   <div id="recaptcha-container" />
        // </div>
    );
}