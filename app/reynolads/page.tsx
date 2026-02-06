"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
export default function EssayForm() {
const [loading, setLoading] = useState(false);
// const [filePreview, setFilePreview] = useState<string | null>(null);
// const [fileType, setFileType] = useState<string | null>(null);
// const [fileName, setFileName] = useState<string>("");
const [essayFile, setEssayFile] = useState<File | null>(null);
const [essayPreview, setEssayPreview] = useState<string | null>(null);

const [selfieFile, setSelfieFile] = useState<File | null>(null);
const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

const { success, error } = useToast();

const submitForm = async (e: any) => {
	e.preventDefault();
	setLoading(true);

	const formData = new FormData(e.target);

	const res = await fetch("/api/reynolads/submit", {
		method: "POST",
		body: formData,
	});

	const data = await res.json();
	setLoading(false);
	success(data.message, {
		position: "top-right",
		duration: 3000,
		description: data.message,
	});
	// formData.reset();

	resetFileInput();
};

// const handleFileChange = (e: any) => {
// 	const file = e.target.files[0];
// 	if (!file) return;

// 	setFileName(file.name);
// 	setFileType(file.type);

// 	if (file.type.startsWith("image/")) {
// 		setFilePreview(URL.createObjectURL(file));
// 	} else {
// 		setFilePreview(null);
// 	}
// };
const handleEssayChange = (e: any) => {
	const file = e.target.files?.[0];
	if (!file) return;

	setEssayFile(file);

	if (file.type.startsWith("image/")) {
		setEssayPreview(URL.createObjectURL(file));
	} else {
		setEssayPreview(null);
	}
};

const handleSelfieChange = (e: any) => {
	const file = e.target.files?.[0];
	if (!file) return;

	setSelfieFile(file);
	setSelfiePreview(URL.createObjectURL(file));
};


const resetFileInput = () => {
	setEssayFile(null);
	setSelfiePreview(null);
	// If you want to reset the file input field as well, you can do it like this:
	const fileInput = document.getElementById("essayUpload") as HTMLInputElement;
	if (fileInput) fileInput.value = "";
	const selfieInput = document.getElementById("selfieUpload") as HTMLInputElement;
	if (selfieInput) selfieInput.value = "";
}

const Locations = [
	"Patna",
	"Ara",
	"Buxar",
	"Begusarai",
	"Biharsharif",
	"Sheikhpura",
	"Chapra",
	"Siwan",
	"Gopalganj",
	"Hajipur",
	"Jehanabad",
	"Arwal",
	"Bhagalpur",
	"Munger",
	"Banka",
	"Jamui",
	"Khagaria",
	"Lakhisarai",
	"Purnea",
	"Araria",
	"Katihar",
	"Kishanganj",
	"Madhepura",
	"Saharsa",
	"Supaul",
	"Gaya",
	"Nawada",
	"Aurangabad",
	"Rohtas",
	"Kaimur",
	"Muzaffarpur",
	"Bettiah",
	"Madhubani",
	"Motihari",
	"Darbhanga",
	"Sheohar",
	"Sitamarhi",
	"Samastipur",
	"Ranchi",
	"Khunti",
	"Chatra",
	"Hazaribagh",
	"Kodarma",
	"Ramgarh",
	"Garhwa",
	"Palamu",
	"Latehar",
	"Gumla",
	"Lohardaga",
	"Simdega",
	"Dhanbad",
	"Bokaro",
	"Deoghar",
	"Dumka",
	"Jamtara",
	"Giridih",
	"Godda",
	"Pakur",
	"Sahibganj",
	"East Singhbhum",
	"Seraikela-Kharsawan",
	"West Singhbhum",
	"Kanpur",
	"Kannauj",
	"Kanpur Dehat",
	"Auraiya",
	"Hamirpur",
	"Jhansi",
	"Chitrakoot",
	"Mahoba",
	"Unnao",
	"Fathepur",
	"Farukhabad",
	"Etawah",
	"Hardoi",
	"Banda",
	"Orai",
	"Lalitpur",
	"Lucknow",
	"Ambedkar Nagar",
	"Amethi",
	"Bahraich", 
	"Balrampur",
	"Barabanki",
	"Ayodhya",
	"Gonda",
	"Raibareilly",
	"Shravasti",
	"Sitapur",
	"Sultanpur",
	"Gorakhpur",
	"Gorakhpur Dehat",
	"Basti",
	"Sant Kabir Nagar",
	"Maharajganj",
	"Siddharthnagar",
	"Kushinagar",
	"Deoria",
	"Prayagraj",
	"Gangapar/Yamunapar",
	"Kaushambi",
	"Pratapgarh",
	"Varanasi",
	"Azamgarh",
	"Ballia",
	"Bhadohi",
	"Chandauli",
	"Ghazipur",
	"Jaunpur",
	"Mau",
	"Mirzapur",
	"Sonbhadra",
	"Agra",
	"Etah",
	"Firozabad",
	"Kasganj",
	"Mainpuri",
	"Mathura",
	"Aligarh",
	"Hathras",
	"Bareilly",
	"Budaun",
	"Pilibhit",
	"Shahjahanpur",
	"Lakhimpur",
	"Moradabad",
	"Rampur", 
	"Amroha", 
	"Sambhal",
	"Meerut",
	"Baghpat",
	"Bijnor",
	"Bulandshahr",
	"Hapur",
	"Muzaffarnagar",
	"Saharanpur",
	"Shamli",
	"Nainital",
	"Haldwani",
	"Udhamsingh Nagar",
	"Almora",
	"Bageshwar",
	"Pithoragarh",
	"Champawat",
	"Dehradun",
	"Vikas Nagar",
	"Rishikesh",
	"Haridwar",
	"Roorkee",
	"Chamoli",
	"Pauri Garhwal",
	"Rudraprayag",
	"Tehri Garhwal",
	"Uttarkashi",
];

return (
	<div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex flex-col items-center justify-center p-4">
		<div className="w-full max-w-2xl rounded-2xl my-6">
			<Image 
				src="/images/hero/reynolads-header.jpg" 
				alt="Reynolds Logo" 
				className="mb-6 rounded-2xl" 
				width={800}
				height={600}
				unoptimized
				/>
		</div>
		<div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
			<h1 className="text-2xl font-bold text-gray-800 mb-6 text-left">
				One Super Power I would like to have &amp; Why - Reynolds Essay Competition
			</h1>
			<p className="text-md text-gray-800 mb-6 text-left"><strong>Imagine. Write. Win!</strong> Tell us about one superpower you wish you had and why, and you could be one of the lucky winners to receive a Reynolds gift hamper. Fill up the below form with the necessary details.</p>

			<form onSubmit={submitForm} className="space-y-4">
				{/* Inputs */}
				<div className="grid grid-cols-1 gap-4">
					<div className="space-y-2">
						<Label htmlFor="Name">Name <span className="text-red-600">*</span></Label>
						<Input name="name" id="Name" required />
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="Age">Age <span className="text-red-600">*</span></Label>
						<Input name="age" id="Age" required />
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="Gender">Gender</Label>

						<Select
							required
							name="gender"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Gender" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Male">Male</SelectItem>
								<SelectItem value="Female">Female</SelectItem>
								<SelectItem value="Others">Others</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="Class">Class</Label>

						<Select
							required
							name="class"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Class" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Class 5">Class 5</SelectItem>
								<SelectItem value="Class 6">Class 6</SelectItem>
								<SelectItem value="Class 7">Class 7</SelectItem>
								<SelectItem value="Class 8">Class 8</SelectItem>
							</SelectContent>
						</Select>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="School">School <span className="text-red-600">*</span></Label>
						<Input name="school" id="School" required />
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="Phone">Phone <span className="text-red-600">*</span></Label>
						<Input name="phone" id="Phone" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="Location">Location</Label>

						<Select
							required
							name="location"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Location" />
							</SelectTrigger>
							<SelectContent>
								{Locations.map((loc, idx) => (
									<SelectItem key={idx} value={loc}>{loc}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>


				{/* File Upload */}
				<p className="text-sm text-black-800 mb-6 text-left">Upload your essay here <sub className="text-red-600">*</sub></p>
				<div className="border-2 relative border-dashed rounded-xl p-4 text-center hover:border-blue-400 transition">
					<input
						name="essay"
						type="file"
						accept=".pdf,.doc,.docx,.jpg,.png"
						required
						onChange={handleEssayChange}
						className="visually-hidden"
						id="essayUpload"
						style={{
							position: "absolute",
							left: "0",
							width: "100%",
							height: "100%",
							top: "0",
							opacity: "0",
							cursor: "pointer",
						}}	
					/>
					<label htmlFor="fileUpload" className="cursor-pointer">
						<p className="text-sm text-gray-500">
							Click to upload Essay (PDF, DOC, Image)
						</p>
					</label>

					{/* Preview */}
					{essayFile && (
						<div className="mt-4">
							{essayPreview ? (
								<div className="relative mx-auto h-32 w-32">
									<Image
										src={essayPreview}
										alt="Essay Preview"
										fill
										className="rounded-lg object-cover shadow"
									/>
								</div>
							) : (
								<p className="text-sm font-medium">{essayFile.name}</p>
							)}
						</div>
					)}
				</div>

				{/* File Upload */}
				<p className="text-sm text-black-800 mb-6 text-left">Upload your selfie holding a Reynolds Trimax pen here <sub className="text-red-600">*</sub></p>
				<div className="border-2 relative border-dashed rounded-xl p-4 text-center hover:border-blue-400 transition">
					<input
						name="selfie"
						type="file"
						accept=".jpg,.png"
						required
						onChange={handleSelfieChange}
						className="visually-hidden"
						id="selfieUpload"
						style={{
							position: "absolute",
							left: "0",
							width: "100%",
							height: "100%",
							top: "0",
							opacity: "0",
							cursor: "pointer",
						}}
					/>
					<label htmlFor="selfieUpload" className="cursor-pointer">
						<p className="text-sm text-gray-500">
							Click to upload Selfie (PDF, DOC, Image)
						</p>
					</label>

					{/* Preview */}
					{selfieFile && (
						<div className="mt-4">
							<div className="relative mx-auto h-32 w-32">
								<Image
									src={selfiePreview!}
									alt="Selfie Preview"
									fill
									className="rounded-lg object-cover shadow"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Checkbox */}
				
				<div className="flex space-x-3 mt-6">
					<input
						type="checkbox"
						id="terms"
						className="w-8 h-8"
					/>
					<Label htmlFor="terms" className="text-md font-bold">
						I confirm that all the above information is correct, and I understand that any misinformation may cancel my participation 
					</Label>
				</div>

				{/* Button */}
				<Button
					disabled={loading}
					className="h-10 block md:inline"
				>
					{loading ? "Submitting..." : "Submit"}
				</Button>
			</form>
		</div>
	</div>
);
}
