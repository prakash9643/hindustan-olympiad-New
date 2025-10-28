"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const schoolFaqs: FAQItem[] = [
  {
    question: "1. What is the Hindustan Olympiad?",
    answer: (
			<>
				<p className="mb-4">Hindustan Olympiad is a multi-subject academic competition for school students from Classes 1 to 12, organised by Hindustan (Hindustan Media Ventures Ltd.).</p>
				<p>It is designed to promote analytical thinking, application-based learning, and overall academic growth.</p>
			</>
		)
  },
  {
    question: "2. Who can participate?",
    answer: (
			<>
				<p className="mb-4">Any student from Classes 1 to 12 studying in a recognised school in Uttar Pradesh, Bihar, Jharkhand or Uttarakhand can participate.</p>
				<p>The school needs to officially register for the Olympiad.</p>
			</>
		)
  },
];

const individualFaqs: FAQItem[] = [
  {
    question: "3. How can our school register?",
    answer: (
			<>
				<p className="mb-4">Schools need to fill out a School Consent Form and submit it to their local Hindustan Olympiad representative.</p>
				<p>After this, they will receive student registration forms and promotional materials. The school collects filled forms and fees from students and submits them back to their local Hindustan Olympiad representative.</p>
			</>
		)
  },
  {
    question: "4. What is the registration fee?",
    answer:(
			<p>A: ₹250 per student (one-time, inclusive of taxes).</p>
		)
  },
  {
    question: "5. What if our school missed the deadline?",
    answer:(
			<p>Contact your local Hindustan Olympiad coordinator immediately. Late submissions may be considered if logistics allow.</p>
		)
  },
];

const ExaminationFaqs: FAQItem[] = [
  {
    question: "6. What is the exam format?",
    answer: (
			<>
				<ul>
					<li>●	A:100 multiple-choice questions (MCQs)</li>
					<li>●	2 hours duration</li>
					<li>●	Medium: Hindi or English</li>
					<li>●	Questions based on 5 subjects (as per your class/stream)</li>
					<li>●	Conducted offline at your school under supervision</li>
				</ul>
			</>
		)
  },
  {
    question: "7. What syllabus will the exam follow?",
    answer:(
			<p>It will be based on the general syllabus of CBSE, ICSE, and State Boards — focusing on application-based questions, logical reasoning, and problem-solving.</p>
		)
  },
];

const RewardsRecognitionfaqs: FAQItem[] = [
  {
    question: "8. What prizes are given to students?",
    answer: (
			<>
				<ul className="mb-4">
					<li>●	District Level: ₹1,100, ₹2,100, ₹3,100 (Top 3)</li>
					<li>●	Regional Level: ₹3,100, ₹4,100, ₹5,100 (Top 3)</li>
					<li>●	National Level: Smartphone, Tablet, Laptop (Top 3)</li>
				</ul>
				<p>Additionally, 5 lucky draw winners, who have scored ~75% will win an electric scooter each and
					1 lucky winner, who has scored ~90% will win a car
				</p>
			</>
		)
  },
  {
    question: "9. Will every participant get a certificate?",
    answer:(
			<p>Yes, every student who appears for the exam will get a Certificate of Participation and a detailed Assessment Report.</p>
		)
  },
];

const SupportforSchoolsfaqs: FAQItem[] = [
  {
    question: "10. What if we lose forms or documents?",
    answer: (
			<>
				<p>Contact your local Hindustan Olympiad representative immediately. Copies can be resent, and lost student entries can be manually added if verified.</p>
			</>
		)
  },
];


const SpecialCasesfaqs: FAQItem[] = [
  {
    question: "11. Can a student participate again if they did last year?",
    answer: (
			<>
				<p>Contact your local Hindustan Olympiad representative immediately. Copies can be resent, and lost student entries can be manually added if verified.</p>
			</>
		)
  },
	{
    question: "12. Can we correct/revise student details after form submission?",
    answer: (
			<>
				<p className="mb-8">Yes, but only up to 10 days before the exam. Contact your local Hindustan Olympiad representative as soon as possible.</p>
				<p className="font-bold">Key Dates</p>
				<ul>
					<li>●	Registration: 1st July – 30th September 2025</li>
					<li>●	Exam: 5th – 20th December 2025</li>
					<li>●	Results: February 2026</li>
					<li>●	Felicitation Ceremonies: February–March 2026</li>
				</ul>
			</>
		)
  },
];

const MaterialsLogisticsfaqs: FAQItem[] = [
  {
    question: "13. What materials will schools receive?",
    answer: (
			<>
				<p>School login ID, printed registration forms, posters, leaflets, and marketing support material.</p>
			</>
		)
  },
	{
    question: "14. Will exam papers and answer sheets be provided?",
    answer: (
			<>
				<p className="mb-8">Yes. Hindustan provides printed question papers and OMR answer sheets with clear guidelines.</p>
			</>
		)
  },
];

const SupportHelpfaqs: FAQItem[] = [
  {
    question: "15. How can we contact the Hindustan Olympiad team?",
    answer: (
			<>
				<p>Email us on <a href="mailto:olympiadsupport@livehindustan.com" className="text-primary">olympiadsupport@livehindustan.com</a> </p>
			</>
		)
  },
];

const Miscellaneousfaqs: FAQItem[] = [
  {
    question: "16. Who conducts the exam?",
    answer: (
			<>
				<p>The exam is held in your school premises, supervised by school staff. The Hindustan team randomly visits some schools for monitoring.</p>
			</>
		)
  },
	{
    question: "17. Can we choose our own exam date?",
    answer: (
			<>
				<p>No, it’s held on specific dates. However, in exceptional cases, an alternative date can be arranged if logistics allow.</p>
			</>
		)
  },
];

const GeneralRegistrationfaqs: FAQItem[] = [
  {
    question: "1. Who can register for the Hindustan Olympiad as an individual?",
    answer: (
			<>
				<p>Any student from Class 1 to Class 12 can register individually, regardless of whether their school is participating or not.</p>
			</>
		)
  },
	{
    question: "2. What is the age/grade eligibility for participation?",
    answer: (
			<>
				<p>The Olympiad is open to all school students from Class 1 to 12.</p>
			</>
		)
  },
	{
    question: "3. Do I need my school’s approval to register individually?",
    answer: (
			<>
				<p> No, school approval is not required for individual registration. You can directly register yourself.</p>
			</>
		)
  },
];

const RegistrationProcessfaqs: FAQItem[] = [
  {
    question: "4. What details do I need to provide during registration?",
    answer: (
			<>
				<p>You need your name, class, section, stream for students in 11th and 12th standard, parent name, mobile number, email ID, school details and Date of Birth.</p>
			</>
		)
  },
	{
    question: "5. Do I need to upload any documents during registration?",
    answer: (
			<>
				<p>No, documents are not required at the time of registration.</p>
			</>
		)
  },
	{
    question: "6. How will I know if my registration is successful?",
    answer: (
			<>
				<p> You will receive a confirmation SMS and/or an email after successful payment.</p>
			</>
		)
  },
	{
    question: "7. What should I do if I made a mistake while filling the form?",
    answer: (
			<>
				<p> You can write to <a href="mailto: olympiadsupport@livehindustan.com" className="text-primary"> olympiadsupport@livehindustan.com</a> with your details and the correction required.</p>
			</>
		)
  },
];

const PaymentFeesfaqs: FAQItem[] = [
  {
    question: "8. What is the registration fee for individual participation?",
    answer: (
			<>
				<p>The registration fee is ₹250 for Hindustan Olympiad 2025.</p>
			</>
		)
  },
	{
    question: "9. How can I make the payment?",
    answer: (
			<>
				<p>Payment can be made online through UPI, debit/credit cards, or net banking.</p>
			</>
		)
  },
	{
    question: "10. What should I do if the payment fails but money is deducted?",
    answer: (
			<>
				<p> Usually, such payments are auto-refunded within 30 working days. If not, write to olympiadsupport@livehindustan.com with transaction details.</p>
			</>
		)
  },
	{
    question: "11. Is the registration fee refundable or transferable?",
    answer: (
			<>
				<p>No, the registration fee is non-refundable* and non-transferable.</p>
			</>
		)
  },
];

const RollNumberAdmitCardfaqs: FAQItem[] = [
  {
    question: "12. When will I receive my roll number after registration?",
    answer: (
			<>
				<p>Your roll number will be generated and shared on your registered mobile/email once you have paid the registration fees and registered for Hindustan Olympiad 2025.</p>
			</>
		)
  },
	{
    question: "13. How will I get my admit card?",
    answer: (
			<>
				<p>Your Admit card will be sent to your registered email ID, 7 days prior to the exam.</p>
			</>
		)
  },
];

const ExamCentresExamDetailsfaqs: FAQItem[] = [
  {
    question: "14. How are exam centres allotted for individual students?",
    answer: (
			<>
				<p>While registering, you need to select one city out of the 20 available exam cities. The centre within that city will be mentioned on your admit card.</p>
			</>
		)
  },
	{
    question: "15. Can I change my exam centre after registration?",
    answer: (
			<>
				<p>No, once selected, the exam centre city cannot be changed. Please choose carefully while registering.</p>
			</>
		)
  },
	{
    question: "16. Will travel or stay arrangements be provided for students?",
    answer: (
			<>
				<p>No, students have to make their own travel and stay arrangements to reach the exam centre.</p>
			</>
		)
  },
	{
    question: "17. What should I carry to the exam centre?",
    answer: (
			<>
				<p>You must carry your admit card, a valid ID proof that mentions your Date Of Birth, and basic stationery (pen/pencil as instructed).</p>
			</>
		)
  },
	{
    question: "18. What is the duration of the exam?",
    answer: (
			<>
				<p>The exam duration is 180 minutes.</p>
			</>
		)
  },
	{
    question: "19. What time should I reach the exam centre?",
    answer: (
			<>
				<p>Students are advised to report at least 30 minutes before the exam start time mentioned on the admit card.</p>
			</>
		)
  },
	{
    question: "20. Can parents/guardians accompany students inside the exam centre?",
    answer: (
			<>
				<p>Parents/guardians may accompany students up to the registration desk, but they will not be allowed inside the examination hall. They can wait outside the centre premises until the exam is over.</p>
			</>
		)
  },
];

function FAQSection({
  title,
  faqs,
}: {
  title: string;
  faqs: FAQItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-10">
      <h2 className="text-1xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="flex justify-between items-center w-full px-4 py-3 text-left"
            >
              <span className="font-medium text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <CardContent className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-left mb-1 text-primary">
        <u>FAQ For Olympiad 2025</u>
      </h1>
			<p className="mb-8">(Registration via schools)</p>
      <FAQSection title="General Information" faqs={schoolFaqs} />
      <FAQSection title="Registration & Participation" faqs={individualFaqs} />
			<FAQSection title="Examination Details" faqs={ExaminationFaqs} />
			<FAQSection title="Rewards & Recognition" faqs={RewardsRecognitionfaqs} />
			<FAQSection title="Support for Schools" faqs={SupportforSchoolsfaqs} />
			<FAQSection title="Special Cases" faqs={SpecialCasesfaqs} />
			<FAQSection title="Materials & Logistics" faqs={MaterialsLogisticsfaqs} />
			<FAQSection title="Support & Help" faqs={SupportHelpfaqs} />
			<FAQSection title="Miscellaneous" faqs={Miscellaneousfaqs} />
      <h1 className="text-3xl font-bold text-left mb-1 text-primary">
        <u>FAQ For Olympiad 2025</u>
      </h1>
			<p className="mb-8">(Registration via Individual Registration)</p>
			<FAQSection title="General Registration" faqs={GeneralRegistrationfaqs} />
			<FAQSection title="Registration Process" faqs={RegistrationProcessfaqs} />
			<FAQSection title="Payment & Fees" faqs={PaymentFeesfaqs} />
			<FAQSection title="Roll Number & Admit Card" faqs={RollNumberAdmitCardfaqs} />
			<FAQSection title="Exam Centres & Exam Details" faqs={ExamCentresExamDetailsfaqs} />
    </div>
  );
}
// Note: The above code is a React component for an FAQ page with sections for school and individual registrations.