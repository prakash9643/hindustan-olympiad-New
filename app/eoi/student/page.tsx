"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
// Payment Modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";
import { Loader2 } from "lucide-react"; // ✅ spinner icon
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


// Region → District mapping
const regionDistrictMap: Record<string, { value: string; label: string }[]> = {
  "East UP": [
    { value: "Allahabad", label: "Allahabad" },
    { value: "Ambedkar Nagar", label: "Ambedkar Nagar" },
    { value: "Amethi", label: "Amethi" },
    { value: "Auraiya", label: "Auraiya" },
    { value: "Ayodhya", label: "Ayodhya" },
    { value: "Azamgarh", label: "Azamgarh" },
    { value: "Bahraich", label: "Bahraich" },
    { value: "Ballia", label: "Ballia" },
    { value: "Balrampur", label: "Balrampur" },
    { value: "Banda", label: "Banda" },
    { value: "Barabanki", label: "Barabanki" },
    { value: "Basti", label: "Basti" },
    { value: "Bhadohi", label: "Bhadohi" },
    { value: "Chandauli", label: "Chandauli" },
    { value: "Chitrakoot", label: "Chitrakoot" },
    { value: "Deoria", label: "Deoria" },
    { value: "Etawah", label: "Etawah" },
    { value: "Farrukabad", label: "Farrukabad" },
    { value: "Fatehpur", label: "Fatehpur" },
    { value: "Gangapar", label: "Gangapar" },
    { value: "Ghazipur", label: "Ghazipur" },
    { value: "Gonda", label: "Gonda" },
    { value: "Gorakhpur", label: "Gorakhpur" },
    { value: "Hamirpur", label: "Hamirpur" },
    { value: "Hardoi", label: "Hardoi" },
    { value: "Jalaun", label: "Jalaun" },
    { value: "Jaunpur", label: "Jaunpur" },
    { value: "Jhansi", label: "Jhansi" },
    { value: "Kannauj", label: "Kannauj" },
    { value: "Kanpur City", label: "Kanpur City" },
    { value: "Kanpur Dehat", label: "Kanpur Dehat" },
    { value: "Kaushambi", label: "Kaushambi" },
    { value: "Kushinagar", label: "Kushinagar" },
    { value: "Lalitpur", label: "Lalitpur" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Maharajganj", label: "Maharajganj" },
    { value: "Mahoba", label: "Mahoba" },
    { value: "Mau", label: "Mau" },
    { value: "Mirzapur", label: "Mirzapur" },
    { value: "Pratapgarh", label: "Pratapgarh" },
    { value: "Rae Bareli", label: "Rae Bareli" },
    { value: "Sant Kabir Nagar", label: "Sant Kabir Nagar" },
    { value: "Shravasti", label: "Shravasti" },
    { value: "Siddhartha nagar", label: "Siddhartha nagar" },
    { value: "Sitapur", label: "Sitapur" },
    { value: "Sonbhadra", label: "Sonbhadra" },
    { value: "Sultanpur", label: "Sultanpur" },
    { value: "Unnao", label: "Unnao" },
    { value: "Varanasi", label: "Varanasi" },
  ],
  "West UP": [
    { value: "Agra", label: "Agra" },
    { value: "Aligarh", label: "Aligarh" },
    { value: "Amroha", label: "Amroha" },
    { value: "Badaun", label: "Badaun" },
    { value: "Baghpat", label: "Baghpat" },
    { value: "Bareilly", label: "Bareilly" },
    { value: "Bijnor", label: "Bijnor" },
    { value: "Bulandshahr", label: "Bulandshahr" },
    { value: "Etah", label: "Etah" },
    { value: "Firozabad", label: "Firozabad" },
    { value: "Hapur", label: "Hapur" },
    { value: "Hathras", label: "Hathras" },
    { value: "Kasganj", label: "Kasganj" },
    { value: "Lakhimpur", label: "Lakhimpur Kheri" },
    { value: "Mainpuri", label: "Mainpuri" },
    { value: "Mathura", label: "Mathura" },
    { value: "Meerut", label: "Meerut" },
    { value: "Moradabad", label: "Moradabad" },
    { value: "Muzzafarnagar", label: "Muzzafarnagar" },
    { value: "Pilibhit", label: "Pilibhit" },
    { value: "Rampur", label: "Rampur" },
    { value: "Saharanpur", label: "Saharanpur" },
    { value: "Sambhal", label: "Sambhal" },
    { value: "Shahjahanpur", label: "Shahjahanpur" },
    { value: "Shamli", label: "Shamli" },
  ],
  "Bihar": [
    { value: "Ara", label: "Ara" },
    { value: "Araria", label: "Araria" },
    { value: "Arwal", label: "Arwal" },
    { value: "Aurangabad", label: "Aurangabad" },
    { value: "Banka", label: "Banka" },
    { value: "Begusarai", label: "Begusarai" },
    { value: "Bettiah", label: "Bettiah" },
    { value: "Bhagalpur", label: "Bhagalpur" },
    { value: "Biharsharif", label: "Biharsharif" },
    { value: "Buxar", label: "Buxar" },
    { value: "Chapra", label: "Chapra" },
    { value: "Darbhanga", label: "Darbhanga" },
    { value: "Gaya", label: "Gaya" },
    { value: "Gopalganj", label: "Gopalganj" },
    { value: "Hajipur", label: "Hajipur" },
    { value: "Jamui", label: "Jamui" },
    { value: "Jehanabad", label: "Jehanabad" },
    { value: "Kaimur", label: "Kaimur" },
    { value: "Katihar", label: "Katihar" },
    { value: "Khagaria", label: "Khagaria" },
    { value: "Kishanganj", label: "Kishanganj" },
    { value: "Lakhisarai", label: "Lakhisarai" },
    { value: "Madhepura", label: "Madhepura" },
    { value: "Madhubani", label: "Madhubani" },
    { value: "Motihari", label: "Motihari" },
    { value: "Munger", label: "Munger" },
    { value: "Muzaffarpur", label: "Muzaffarpur" },
    { value: "Nawada", label: "Nawada" },
    { value: "Patna", label: "Patna" },
    { value: "Purnea", label: "Purnea" },
    { value: "Rohtas", label: "Rohtas" },
    { value: "Saharsa", label: "Saharsa" },
    { value: "Samastipur", label: "Samastipur" },
    { value: "Sheikhpura", label: "Sheikhpura" },
    { value: "Sheohar", label: "Sheohar" },
    { value: "Sitamarhi", label: "Sitamarhi" },
    { value: "Siwan", label: "Siwan" },
    { value: "Supaul", label: "Supaul" }
  ],
  "Jharkhand": [
    { value: "Bokaro", label: "Bokaro" },
    { value: "Chatra", label: "Chatra" },
    { value: "Deoghar", label: "Deoghar" },
    { value: "Dhanbad", label: "Dhanbad" },
    { value: "Dumka", label: "Dumka" },
    { value: "East Singhbhum", label: "East Singhbhum" },
    { value: "Garhwa", label: "Garhwa" },
    { value: "Giridih", label: "Giridih" },
    { value: "Godda", label: "Godda" },
    { value: "Gumla", label: "Gumla" },
    { value: "Hazaribagh", label: "Hazaribagh" },
    { value: "Jamtara", label: "Jamtara" },
    { value: "Khunti", label: "Khunti" },
    { value: "Kodarma", label: "Kodarma" },
    { value: "Latehar", label: "Latehar" },
    { value: "Lohardaga", label: "Lohardaga" },
    { value: "Pakur", label: "Pakur" },
    { value: "Palamu", label: "Palamu" },
    { value: "Ramgarh", label: "Ramgarh" },
    { value: "Ranchi", label: "Ranchi" },
    { value: "Sahibganj", label: "Sahibganj" },
    { value: "Saraikela-Kharsawan", label: "Saraikela-Kharsawan" },
    { value: "Simdega", label: "Simdega" },
    { value: "West Singhbhum", label: "West Singhbhum" }
  ],
  "Uttarakhand": [
    { value: "Almora", label: "Almora" },
    { value: "Bageshwar", label: "Bageshwar" },
    { value: "Chamoli", label: "Chamoli" },
    { value: "Champawat", label: "Champawat" },
    { value: "Dehradun", label: "Dehradun" },
    { value: "Haldwani", label: "Haldwani" },
    { value: "Haridwar", label: "Haridwar" },
    { value: "Nainital", label: "Nainital" },
    { value: "Pauri Garhwal", label: "Pauri Garhwal" },
    { value: "Pithoragarh", label: "Pithoragarh" },
    { value: "Rishikesh", label: "Rishikesh" },
    { value: "Roorkee", label: "Roorkee" },
    { value: "Rudraprayag", label: "Rudraprayag" },    
    { value: "Tehri Garhwal", label: "Tehri Garhwal" },  
    { value: "Udham Singh Nagar", label: "Udham Singh Nagar" },
    { value: "Uttarkashi", label: "Uttarkashi" },
    { value: "Vikas Nagar", label: "Vikas Nagar" },
  ],
};

// ✅ Direct District (City) list
const City: { value: string; label: string }[] = [
  { value: "kanpur", label: "Kanpur" },
  { value: "lucknow", label: "Lucknow" },
  { value: "gorakhpur", label: "Gorakhpur" },
  { value: "allahabad", label: "Allahabad" },
  { value: "varanasi", label: "Varanasi" },
  { value: "agra", label: "Agra" },
  { value: "aligarh", label: "Aligarh" },
  { value: "bareilly", label: "Bareilly" },
  { value: "meerut", label: "Meerut" },
  { value: "moradabad", label: "Moradabad" },
  { value: "patna", label: "Patna" },
  { value: "bhagalpur", label: "Bhagalpur" },
  { value: "muzaffarpur", label: "Muzaffarpur" },
  { value: "gaya", label: "Gaya" },
  { value: "purnea", label: "Purnea" },
  { value: "ranchi", label: "Ranchi" },
  { value: "dhanbad", label: "Dhanbad" },
  { value: "jamshedpur", label: "Jamshedpur" },
  { value: "haldwani", label: "Haldwani" },
  { value: "dehradun", label: "Dehradun" },
];

// ...existing code...
interface StudentFormData {
  name: string;
  class: string;
  section: string;
  gender: string;
  stream: string;
  parentName: string;
  parentContact: string;
  parentEmail: string,
  schoolName: string;
  schoolBranch: string;
  schoolAddress: string;
  district: string;
  dateOfBirth: Date | null;
  region: string;
  schoolDistrict: string; // 👈 new field
  relationshipWithStudent: string; // 👈 new field
}

export default function StudentRegistrationPage() {
  const [region, setRegion] = useState("");  
  const router = useRouter();
  const [studentForm, setStudentForm] = useState<StudentFormData>({
    name: "",
    class: "",
    section: "",
    gender: "",
    stream: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
    schoolName: "",
    schoolBranch: "",
    schoolAddress: "",
    district: "",
    dateOfBirth: null,
    region: "",
    schoolDistrict: "", // 👈 new field
    relationshipWithStudent: "", // 👈 new field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const [openPopup, setOpenPopup] = useState(false);
  const [agreed, setAgreed] = useState(false);  
  const [contacts, setContacts] = useState(false);

  const handleInputChange = (field: keyof StudentFormData, value: string | Date | null) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
  };
  // ✅ Add this function after your state declarations (around line 150-160)
  const handleRegionChange = (val: string) => {
    setRegion(val);
    setStudentForm(prev => ({ 
      ...prev, 
      region: val, 
      schoolDistrict: "" 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Validation data:", studentForm);
    // Basic validation
    if (
      !region ||
      !studentForm.district ||
      !studentForm.name ||
      !studentForm.class ||
      !studentForm.section ||
      !studentForm.gender ||
      (["11", "12"].includes(studentForm.class) && !studentForm.stream) ||
      !studentForm.parentName ||
      !studentForm.parentContact ||
      !studentForm.parentEmail ||
      !studentForm.schoolName ||
      !studentForm.schoolBranch ||
      !studentForm.dateOfBirth ||
      !studentForm.schoolAddress ||
      // !studentForm.region ||
      !studentForm.schoolDistrict ||
      !studentForm.relationshipWithStudent 
    ) {
      error("All fields are required!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(studentForm.parentContact)) {
      error("Invalid phone number!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (studentForm.parentEmail.trim() !== "" && !emailRegex.test(studentForm.parentEmail)) {
    //     error("Invalid email!", {
    //       duration: 3000,
    //       position: "top-right",
    //       description: "Please enter a valid principal email.",
    //     });
    //     return;
    //   }
    // ✅ Backend call to init student
    const res = await fetch("/api/eoi/student/jwt-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...studentForm, region }),
    });

    const data = await res.json();

    if (!res.ok) {
      error(data.error || "Failed to init", { duration: 3000 });
      setIsSubmitting(false);
      return;
    }

    // ✅ StudentId + Token mil gaye, ab store kar lo
    setStudentForm((prev) => ({
      ...prev,
      studentId: data.studentId,
      token: data.token,
    }));
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("studentId", data.studentId);
    console.log("Received studentId and token:", data);
    setOpenPopup(true);    
  };

  // Start Payment Process
// Start Payment Process
const decodeString = (encodedText: string) => {
  return CryptoJS.enc.Utf8.stringify(
    CryptoJS.enc.Base64.parse(encodedText)
  );
};

const [isPaying, setIsPaying] = useState(false); // ✅ New state for payment loading
const [isRedirecting, setIsRedirecting] = useState(false); // ✅ new state for redirecting
const startPayment = async () => {
  const token = localStorage.getItem("jwtToken");
  const studentId = localStorage.getItem("studentId");
  setIsPaying(true); // ✅ start loading

  if (!token || !studentId) {
    console.error("Token or Student ID missing!");
    setIsPaying(false);
    return;
  }

  try {
    // IP Address
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const ip_address = ipData.ip;
    // 1️⃣ Create Razorpay Order via backend
    const orderRes = await fetch("https://api-portal.htmedia.in/olampiyad/paymentorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({
        amount: 250,
        studentId,
        service: "olympiad-backend",
        ip_address,
      }),
    });

    setOpenPopup(false);
    if (!orderRes.ok) throw new Error("Payment order creation failed");
    const result = await orderRes.json();
    //const { orderId, transactionId, key,amount,currency } = result?.response

  const orderId = result?.response?.id;      // Razorpay order id
const amount = result?.response?.amount;  // Amount in paise
const currency = result?.response?.currency;
const key = decodeString(result?.response?.key);





console.log("this s order data",orderId,amount,currency,"this ksy",key)


    // 2️⃣ Razorpay Checkout
    const options: any = {
      key: key, // from backend ideally
      amount: amount,
      currency: currency,
      name: "Hindustan Olympiad",
      description: "Exam Registration",
      order_id: orderId,
      prefill: {
        name: studentForm.parentName,
        email: studentForm.parentEmail,
        contact: studentForm.parentContact,
      },
      theme: { color: "#3399cc" },

      handler: async function (response: any) {
        console.log("Payment Success Response 👉", response);
       


        try {
          // 3️⃣ Verify Payment on backend
          const verifyRes = await fetch("https://api-portal.htmedia.in/olampiyad/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) throw new Error("Payment verification failed");
          const verifyData = await verifyRes.json();

           const transactionId =  response.razorpay_payment_id

          if (verifyData.msg !== "success") {
            throw new Error("Payment not verified");
          }

          // ✅ Show redirect loader
          setIsRedirecting(true);

          // 4️⃣ Save Student record in DB (same login flow)
          const res = await fetch("/api/eoi/student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...studentForm,
              region,
              orderId,
              transactionId,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Student creation failed");
          }

          const data = await res.json();
          const newStudentId = data.student.studentId;
          // ✅ Mark Payment Verified
          await fetch("/api/eoi/student/paymentVerified", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, transactionId }),
          });
          // 5️⃣ Send Parent SMS
          await fetch("/api/eoi/student/parent-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: studentForm.parentContact,
              studentId: newStudentId,
            }),
          });

          // 6️⃣ Send Parent Email
          await fetch("/api/eoi/student/parent-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...studentForm,
              region: studentForm.region,
              orderId,
              transactionId,
              studentId: newStudentId,
              city: studentForm.district, // agar city field aap form me rakhte ho
            }),
          });

          // 6️⃣ Success UI + redirect
          success("Registration & Payment Successful!", {
            position: "top-right",
            duration: 2000,
          });
          
          setStudentForm({
            name: "",
            class: "",
            section: "",
            gender: "",
            stream: "",
            parentName: "",
            parentContact: "",
            parentEmail: "",
            schoolName: "",
            schoolBranch: "",
            schoolAddress: "",
            district: "",
            dateOfBirth: null,
            region: "",
            schoolDistrict: "", // 👈 new field
            relationshipWithStudent: "", // 👈 new field
          });
          setRegion("");
          // Delay before redirect
          setTimeout(() => {
            router.push(`/thank-you`);
          }, 1500);

        } catch (err: any) {
          error("Verification failed", { duration: 3000, description: err.message });
        }
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

  } catch (err: any) {
    error("Something went wrong!", { duration: 3000, description: err.message });
  } finally {
    setIsSubmitting(false);
    setIsPaying(false); // ✅ stop loading when done
  }
};

const handleClosePopup = () => {
  setOpenPopup(false);
  setIsSubmitting(false); // ✅ reset
};
  


  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/#participate">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardDescription className="text-base font-medium text-black">
              <p className="mb-2">The exam would be conducted in 20 cities across UP, Bihar, Jharkhand and Uttarakhand</p>
              <p className="mb-2"><strong> Kindly select your city of preference.</strong></p>
              <p className="mb-2">The exam centre would be allocated according to your selection and the student will have to reach the exam center on their own.</p>
              <p className="mb-2">Other details related to the exam such as; exam date, center, instructions etc. will be shared along with your Admit card, 7 days prior to the exam date</p>              
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ Direct District (City) Dropdown */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="district">City</Label>
              <Select
                value={studentForm.district}
                onValueChange={(value) => setStudentForm((prev) => ({ ...prev, district: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {City.map((district) => (
                    <SelectItem key={district.value} value={district.value}>
                      {district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Form fields */}
            {studentForm.district && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select
                    value={studentForm.class}
                    onValueChange={(value) => setStudentForm((p) => ({ ...p, class: value, stream: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Stream field for class 11/12 */}
                {(studentForm.class === "11" || studentForm.class === "12") && (
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>
                    <Select
                      value={studentForm.stream}
                      onValueChange={(value) => setStudentForm((p) => ({ ...p, stream: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PCB">PCB</SelectItem>
                        <SelectItem value="PCM">PCM</SelectItem>
                        <SelectItem value="COMM">Commerce with Maths</SelectItem>
                        <SelectItem value="COMW">Commerce without Maths</SelectItem>
                        <SelectItem value="ARTS">Humanities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Input value={studentForm.section} onChange={(e) => setStudentForm((p) => ({ ...p, section: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={studentForm.gender}
                    onValueChange={(value) => setStudentForm((p) => ({ ...p, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>        
                <div className="space-y-2">
                  <Label>Date of Birth <small className="text-[#B2252A]">(As mentioned in students Aadhar card or any other valid govt ID proof of the student)</small></Label>
                  <div className="w-full">
                    <DatePicker
                      selected={studentForm.dateOfBirth}
                      onChange={(date) => handleInputChange("dateOfBirth", date)}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={85} // ✅ 2025 - 85 = 1940
                      minDate={new Date(1940, 0, 1)} // ✅ explicitly 1940 set karein
                      placeholderText="Pick a date"
                      className="w-full border rounded px-2 py-2"
                    />
                  </div>
                </div>    
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input value={studentForm.parentName} onChange={(e) => setStudentForm((p) => ({ ...p, parentName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream">Relationship to student</Label>
                  <Select
                    value={studentForm.relationshipWithStudent}
                    onValueChange={(value) => setStudentForm((p) => ({ ...p, relationshipWithStudent: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship to student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Number <small className="text-[#B2252A]">(The students Hindustan Olympiad 2025 Roll No. and Admit card will be shared here)</small></Label>
                  <Input value={studentForm.parentContact} onChange={(e) => setStudentForm((p) => ({ ...p, parentContact: e.target.value }))} />
                </div>
                {/* ✅ Email field with validation */}
                <div className="space-y-2">
                  <Label>Email Id <small className="text-[#B2252A]">(The students Hindustan Olympiad 2025 Roll No. and Admit card will be shared here)</small></Label>
                  <Input
                    type="email"
                    value={studentForm.parentEmail}
                    onChange={(e) => setStudentForm((p) => ({ ...p, parentEmail: e.target.value }))}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                </div>
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={studentForm.schoolName} onChange={(e) => setStudentForm((p) => ({ ...p, schoolName: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label>School Branch</Label>
                  <Input value={studentForm.schoolBranch} onChange={(e) => setStudentForm((p) => ({ ...p, schoolBranch: e.target.value }))} />
                </div>

                {/* School Region */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="region">School Region</Label>
                  <Select
                    value={region}
                    onValueChange={handleRegionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(regionDistrictMap).map((reg) => (
                        <SelectItem key={reg} value={reg}>
                          {reg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                
                {/* School District */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="district">School District</Label>
                  <Select
                    value={studentForm.schoolDistrict}
                    onValueChange={(value) => setStudentForm((prev) => ({ ...prev, schoolDistrict: value }))}
                    disabled={!studentForm.region} // disabled until region selected
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionDistrictMap[studentForm.region || region]?.map((schoolDistrict) => (
                        <SelectItem key={schoolDistrict.value} value={schoolDistrict.value}>
                          {schoolDistrict.label}
                        </SelectItem>
                      )) ?? null}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>School Address</Label>
                  <Input value={studentForm.schoolAddress} onChange={(e) => setStudentForm((p) => ({ ...p, schoolAddress: e.target.value }))} />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I, as the parent/guardian of the student, have read and agree to the{" "}
                    <Link href="/Individual-terms" target="_blank" className="text-blue-600 underline">
                      Terms & Conditions
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={contacts}
                    onChange={(e) => setContacts(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I allow Hindustan to contact me through SMS/ Whatsapp/ Call/ Email
                  </Label>
                </div>

                <Button type="submit" disabled={isSubmitting || !agreed || !contacts}>
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Details & Make Payment</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input value={studentForm.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Input value={studentForm.class} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Parent Name</Label>
              <Input value={studentForm.parentName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Parent Contact</Label>
              <Input value={studentForm.parentContact} readOnly />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleClosePopup}>
              Close to Edit
            </Button>
            <Button onClick={startPayment} disabled={isPaying}>
              {isPaying ? "Processing..." : "Make Payment"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
    {isRedirecting && (
      <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#B2252A]" />
        <p className="mt-4 text-lg font-medium text-gray-700">Processing Payment...</p>
      </div>
    )}
    </div>
  );
}
// ...existing code...