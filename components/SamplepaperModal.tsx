"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions, districts } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import OTPInput from "./six-square-login";
import { DialogClose } from "@radix-ui/react-dialog";

interface SamplePaperModalProps {
  open: boolean;
  onClose: () => void;
  user?: { region: string };
}

const OTP_EXPIRY_SECONDS = 180; // 3 minutes
const RESEND_COOLDOWN = 10; // 10 seconds

const SamplePaperModal: React.FC<SamplePaperModalProps> = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    class: "",
    stream: "",
    region: "",
    district: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
	const { success, error } = useToast();
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    } else if (otpSent && otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [otpTimer, otpSent]);

  // Send OTP
  const handleSendOTP = async () => {
    if (!formData.phone || !formData.class || sendingOtp) return;
    setSendingOtp(true);
    try {
      const res = await fetch("/api/sample-paper-Otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, Class: formData.class }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpTimer(OTP_EXPIRY_SECONDS);
				console.log("OTP for testing:", data.otp); // ✅ see OTP in browser console
        setCanResend(false);
        setOtp(""); // clear input        
				success("OTP sent to your phone!", {
          position: "top-right",
          duration: 100,
          description: "Check your phone for the OTP.",
        });
      } else {
        console.error(data);
				error("Failed to send OTP. Try again !", {
					duration: 100,
					position: "top-right",
					description: "Please try again later.",
				});
      }
    } catch (err) {
      console.error(err);
			error("Error sending OTP", {
				duration: 100,
				position: "top-right",
				description: "Please try again later.",
			});
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otpTimer === 0) {
			error("OTP expired. Please resend.", {
				duration: 100,
				position: "top-right",
				description: "Please try again later.",
			});
      return;
    }
    if (otp === otp) {
      try {
        const res = await fetch("/api/SamplePaper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, otpVerified: true }),
        });
        const data = await res.json();

        if (data.success) {
          setOtpVerified(true);
          success("OTP verified!", {
            position: "top-right",
            duration: 100,
            description: "You can now download the sample paper.",
          });
        } else {
          error("Failed to save request.", {
            position: "top-right",
            duration: 100,
            description: data.message,
          });
        }
      } catch (err) {
        console.error(err);
        error("Error saving request.", {
          position: "top-right",
          duration: 100,
          description: "Please try again later.",
        });
      }
    }

  };

  // Resend OTP
  const handleResendOTP = () => {
    setCanResend(false);
    handleSendOTP();
    let cooldown = RESEND_COOLDOWN;
    const interval = setInterval(() => {
      cooldown--;
      if (cooldown <= 0) {
        clearInterval(interval);
        setCanResend(true);
      }
    }, 1000);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  function getOrdinal(n: string) {
    const num = parseInt(n);
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl max-h-[80vh] [&>button]:hidden overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Request Sample Paper
          </DialogTitle>
          <DialogDescription className="text-center">
            {otpSent && !otpVerified
              ? "Enter the OTP sent to your phone."
              : "Fill in your details to get your class-wise sample paper."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Hide input fields once OTP is sent */}
          {!otpSent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Select Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(val) => handleInputChange("class", val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) => {
                      const num = i + 1;

                      // Helper function to get correct ordinal suffix
                      const getOrdinalSuffix = (n: number) => {
                        if (n === 1) return "1st";
                        if (n === 2) return "2nd";
                        if (n === 3) return "3rd";
                        return `${n}th`;
                      };

                      return (
                        <SelectItem key={num} value={`${num}`}>
                          {getOrdinalSuffix(num)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {(formData.class === "11" || formData.class === "12") && (
                <div className="space-y-2">
                  <Label>Select Stream</Label>
                  <Select
                    value={formData.stream}
                    onValueChange={(val) => handleInputChange("stream", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PCB">PCB</SelectItem>
                      <SelectItem value="PCM">PCM</SelectItem>
                      <SelectItem value="COMM">Commerce with Maths</SelectItem>
                      <SelectItem value="COMW">Commerce without Maths</SelectItem>
                      <SelectItem value="Humanities">Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(val) => handleInputChange("region", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(
                      (region) =>
                        (!user?.region || user.region.split(",").includes(region.value)) && (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(val) => handleInputChange("district", val)}
                  disabled={!formData.region}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {(districts[formData.region as keyof typeof districts] || []).map(
                      (district: { value: string; label: string }) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* OTP Section */}
          {otpSent && !otpVerified && (
            <div className="text-center space-y-4">
							<div className="space-y-2">
								{/* <Input
									type="text"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									placeholder="Enter OTP"
									className="w-40"
									disabled={otpTimer === 0}
								/> */}
								<OTPInput onChange={setOtp} />
							</div>
							<div className="space-y-2">
								<Button type="button" onClick={handleVerifyOTP} disabled={otpTimer === 0}>
									Verify OTP
								</Button>
							</div>
              <div className="flex flex-col text-sm mt-2 md:mt-0 items-center">
                {otpTimer > 0 ? (
                  <span className={otpTimer <= 30 ? "text-red-500" : ""}>
                    OTP expires in: {formatTimer(otpTimer)}
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={!canResend}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Download button */}
          {otpVerified && (
            <div className="flex justify-center gap-4">
              <Button
								type="button"
								onClick={() => {
									const isSeniorClass = ["11", "12"].includes(formData.class);
									const fileName = isSeniorClass
										? `${formData.class}-${formData.stream}.pdf`
										: `${formData.class}.pdf`;

									window.open(`/sample-papers/${fileName}`, "_blank");
								}}
							>
                Download Sample Paper{" "}
                {["11", "12"].includes(formData.class)
                  ? `${formData.class} for ${formData.stream}`
                  : `for Class ${getOrdinal(formData.class)}`}
							</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          )}

          {/* Footer buttons */}
          <DialogFooter className="flex flex-col md:flex-row gap-2">
            {!otpSent && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
            {!otpSent && (
              <Button type="button" onClick={handleSendOTP} disabled={sendingOtp}>
                {sendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SamplePaperModal;
