"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { regions, districts } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";

const districts = [
  { value: "01", label: "Agra" },
  { value: "02", label: "Aligarh" },
  { value: "03", label: "Allahabad" },
  { value: "04", label: "Almora" },
  { value: "05", label: "Ambedkar Nagar" },
  { value: "06", label: "Amethi" },
  { value: "07", label: "Amroha" },
  { value: "08", label: "Ara" },
  { value: "09", label: "Araria" },
  { value: "10", label: "Arwal" },
  { value: "11", label: "Auraiya" },
  { value: "12", label: "Aurangabad" },
  { value: "13", label: "Ayodhya" },
  { value: "14", label: "Azamgarh" },
  { value: "15", label: "Badaun" },
  { value: "16", label: "Bageshwar" },
  { value: "17", label: "Baghpat" },
  { value: "18", label: "Bahraich" },
  { value: "19", label: "Ballia" },
  { value: "20", label: "Balrampur" },
  { value: "21", label: "Banda" },
  { value: "22", label: "Banka" },
  { value: "23", label: "Barabanki" },
  { value: "24", label: "Bareilly" },
  { value: "25", label: "Basti" },
  { value: "26", label: "Begusarai" },
  { value: "27", label: "Bettiah" },
  { value: "28", label: "Bhadohi" },
  { value: "29", label: "Bhagalpur" },
  { value: "30", label: "Biharsharif" },
  { value: "31", label: "Bijnor" },
  { value: "32", label: "Bokaro" },
  { value: "33", label: "Bulandshahr" },
  { value: "34", label: "Buxar" },
  { value: "35", label: "Chamoli" },
  { value: "36", label: "Champawat" },
  { value: "37", label: "Chandauli" },
  { value: "38", label: "Chapra" },
  { value: "39", label: "Chatra" },
  { value: "40", label: "Chitrakoot" },
  { value: "41", label: "Darbhanga" },
  { value: "42", label: "Dehradun" },
  { value: "43", label: "Deoghar" },
  { value: "44", label: "Deoria" },
  { value: "45", label: "Dhanbad" },
  { value: "46", label: "Dumka" },
  { value: "47", label: "East Singhbhum" },
  { value: "48", label: "Etah" },
  { value: "49", label: "Etawah" },
  { value: "50", label: "Farrukabad" },
  { value: "51", label: "Fatehpur" },
  { value: "52", label: "Firozabad" },
  { value: "53", label: "Gangapar" },
  { value: "54", label: "Garhwa" },
  { value: "55", label: "Gaya" },
  { value: "56", label: "Ghazipur" },
  { value: "57", label: "Giridih" },
  { value: "58", label: "Godda" },
  { value: "59", label: "Gonda" },
  { value: "60", label: "Gopalganj" },
  { value: "61", label: "Gorakhpur" },
  { value: "62", label: "Gumla" },
  { value: "63", label: "Hajipur" },
  { value: "64", label: "Haldwani" },
  { value: "65", label: "Hamirpur" },
  { value: "66", label: "Hapur" },
  { value: "67", label: "Hardoi" },
  { value: "68", label: "Haridwar" },
  { value: "69", label: "Hathras" },
  { value: "70", label: "Hazaribagh" },
  { value: "71", label: "Jalaun" },
  { value: "72", label: "Jamtara" },
  { value: "73", label: "Jamui" },
  { value: "74", label: "Jaunpur" },
  { value: "75", label: "Jehanabad" },
  { value: "76", label: "Jhansi" },
  { value: "77", label: "Kaimur" },
  { value: "78", label: "Kannauj" },
  { value: "79", label: "Kanpur City" },
  { value: "153", label: "Kanpur Dehat" },
  { value: "80", label: "Kasganj" },
  { value: "81", label: "Katihar" },
  { value: "82", label: "Kaushambi" },
  { value: "83", label: "Khagaria" },
  { value: "84", label: "Khunti" },
  { value: "85", label: "Kishanganj" },
  { value: "86", label: "Kodarma" },
  { value: "87", label: "Kushinagar" },
  { value: "88", label: "Lakhimpur Kheri" },
  { value: "89", label: "Lakhisarai" },
  { value: "90", label: "Lalitpur" },
  { value: "91", label: "Latehar" },
  { value: "92", label: "Lohardaga" },
  { value: "93", label: "Lucknow" },
  { value: "94", label: "Madhepura" },
  { value: "95", label: "Madhubani" },
  { value: "96", label: "Maharajganj" },
  { value: "97", label: "Mahoba" },
  { value: "98", label: "Mainpuri" },
  { value: "99", label: "Mathura" },
  { value: "100", label: "Mau" },
  { value: "101", label: "Meerut" },
  { value: "102", label: "Mirzapur" },
  { value: "103", label: "Moradabad" },
  { value: "104", label: "Motihari" },
  { value: "105", label: "Munger" },
  { value: "106", label: "Muzaffarpur" },
  { value: "107", label: "Muzzafarnagar" },
  { value: "108", label: "Nainital" },
  { value: "109", label: "Nawada" },
  { value: "110", label: "Pakur" },
  { value: "111", label: "Palamu" },
  { value: "112", label: "Patna" },
  { value: "113", label: "Pauri Garhwal" },
  { value: "114", label: "Pilibhit" },
  { value: "115", label: "Pithoragarh" },
  { value: "116", label: "Pratapgarh" },
  { value: "117", label: "Purnea" },
  { value: "118", label: "Rae Bareli" },
  { value: "119", label: "Ramgarh" },
  { value: "120", label: "Rampur" },
  { value: "121", label: "Ranchi" },
  { value: "122", label: "Rishikesh" },
  { value: "123", label: "Rohtas" },
  { value: "124", label: "Roorkee" },
  { value: "125", label: "Rudraprayag" },
  { value: "126", label: "Saharanpur" },
  { value: "127", label: "Saharsa" },
  { value: "128", label: "Sahibganj" },
  { value: "129", label: "Samastipur" },
  { value: "130", label: "Sambhal" },
  { value: "131", label: "Sant Kabir Nagar" },
  { value: "132", label: "Saraikela-Kharsawan" },
  { value: "133", label: "Shravasti" },
  { value: "134", label: "Shahjahanpur" },
  { value: "135", label: "Shamli" },
  { value: "136", label: "Sheikhpura" },
  { value: "137", label: "Sheohar" },
  { value: "138", label: "Siddhartha nagar" },
  { value: "139", label: "Simdega" },
  { value: "140", label: "Sitamarhi" },
  { value: "141", label: "Sitapur" },
  { value: "142", label: "Siwan" },
  { value: "143", label: "Sonbhadra" },
  { value: "144", label: "Sultanpur" },
  { value: "145", label: "Supaul" },
  { value: "146", label: "Tehri Garhwal" },
  { value: "147", label: "Udham Singh Nagar" },
  { value: "148", label: "Unnao" },
  { value: "149", label: "Uttarkashi" },
  { value: "150", label: "Varanasi" },
  { value: "151", label: "Vikas Nagar" },
  { value: "152", label: "West Singhbhum" },
];


interface SchoolFormData {
  schoolName: string;
  schoolCoordinatorContact: string;
  // schoolCoordinatorEmail: string;
  schoolAddress: string;
  // region: string;
  district: string;
}

export default function SchoolRegistrationPage() {
  const [schoolForm, setSchoolForm] = useState<SchoolFormData>({
    schoolName: "",
    schoolCoordinatorContact: "",
    // schoolCoordinatorEmail: "",
    schoolAddress: "",
    // region: "",
    district: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(schoolForm);

    

    if (!/^\d{10}$/.test(schoolForm.schoolCoordinatorContact)) {
      error("Invalid contact number!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a 10-digit phone number.",
      });
      setIsSubmitting(false);
      return;
    }

    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolForm.schoolCoordinatorEmail)) {
    //   error("Invalid email ID!", {
    //     duration: 3000,
    //     position: "top-right",
    //     description: "Please enter a valid email address.",
    //   });
    //   setIsSubmitting(false);
    //   return;
    // }

    // Submit
    try {
      const response = await fetch("/api/eoi/school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schoolForm),
      });

      if (response.ok) {
        success("We have got your message!", {
          position: "top-right",
          duration: 2000,
          description: "We will get back to you soon.",
        });

        setSchoolForm({
          schoolName: "",
          schoolCoordinatorContact: "",
          // schoolCoordinatorEmail: "",
          schoolAddress: "",
          // region: "",
          district: "",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }
    } catch (err: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleStateChange = (state: string) => {
  //   setSchoolForm((prev) => ({
  //     ...prev,
  //     // region: state,
  //     // district: "",
  //   }));
  // };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/#participate">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="text-base font-medium text-black">
              Please share your school’s details so we can initiate the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="your-name">Your Name</Label>
                <Input
                  id="your-name"
                  value={schoolForm.schoolName}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolName: e.target.value }))
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Coordinator Contact */}
              <div className="space-y-2">
                <Label htmlFor="your-contact-number">Your Contact Number</Label>
                <Input
                  id="your-contact-number"
                  value={schoolForm.schoolCoordinatorContact}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolCoordinatorContact: e.target.value }))
                  }
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>

              {/* Coordinator Email */}
              {/* <div className="space-y-2">
                <Label htmlFor="coordinator-email">School Coordinator Email ID</Label>
                <Input
                  id="coordinator-email"
                  type="email"
                  value={schoolForm.schoolCoordinatorEmail}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolCoordinatorEmail: e.target.value }))
                  }
                  placeholder="Enter email address"
                  required
                />
              </div> */}

              {/* School Address */}
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={schoolForm.schoolAddress}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolAddress: e.target.value }))
                  }
                  placeholder="Enter school name"
                  required
                />
              </div>

              {/* Region */}
              {/* <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={schoolForm.region} onValueChange={handleStateChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={schoolForm.district}
                  onValueChange={(val) =>
                    setSchoolForm((prev) => ({ ...prev, district: val }))
                  }
                  // disabled={!schoolForm.region}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
