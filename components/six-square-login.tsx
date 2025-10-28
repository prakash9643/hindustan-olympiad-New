import React, { useState, useRef } from "react";

export default function OTPInput({ onChange }: { onChange: (otp: string) => void }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only keep last digit
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move focus to next input automatically
    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = Array(6).fill("");
    pasteData.forEach((char, i) => {
      if (/[0-9]/.test(char)) newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  return (
    <div className="flex justify-center items-center gap-2 mb-2">
      {Array(6)
        .fill("")
        .map((_, index) => (
          <div key={index}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="lg:h-16 lg:w-16 h-10 w-10  aspect-square text-center text-xl font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              autoComplete="one-time-code"
            />
          </div>
        ))}
    </div>
  );
}
