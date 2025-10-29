import React from "react";
import { useNavigate } from "react-router-dom";

const faqData = [
	{
		question: "Where does budget data come from?",
		answer: "Budget data comes directly from government agencies and departments. Each agency submits their budget proposals, allocations, and spending records through our secure platform. The data is then verified and recorded on the blockchain to ensure transparency and immutability.",
	},
	{
		question: "How often is the data updated?",
		answer: "Data is updated in real-time as transactions occur. Budget allocations are recorded immediately upon approval, and spending is tracked as it happens. You can view the latest updates on your dashboard, and milestone progress is reflected instantly when agencies submit their reports.",
	},
	{
		question: "What does the transparency score mean?",
		answer: "The transparency score is a metric (0-100) that measures how openly and completely an agency shares its budget and spending information. Factors include timely reporting, data completeness, milestone achievement rates, and response time to inquiries. Higher scores indicate better transparency practices.",
	},
	{
		question: "How can I report an issue with the data?",
		answer: "If you notice any discrepancies or issues with the data, you can report them through the 'Contact Support' page. Select 'Data Concern' or 'Data Accuracy' as the issue type, provide specific details about the problem, and attach any supporting documentation. Our team will investigate and respond within 24-48 hours.",
	},
	{
		question: "What are smart contract alerts?",
		answer: "Smart contract alerts are automated notifications triggered by blockchain-based rules. They monitor budget activities and alert you when specific conditions are met, such as: budget threshold reached (80%+), pending approvals, upcoming milestones, unusual spending patterns, or delayed submissions. These help ensure compliance and timely action.",
	},
	{
		question: "How is my privacy protected on this platform?",
		answer: "We use industry-standard encryption (SSL/TLS) for all data transmission. Personal information is stored securely and access is role-based. Blockchain technology ensures data integrity without exposing sensitive details. We comply with data protection regulations and only authorized personnel can access user information. Regular security audits are conducted to maintain system integrity.",
	},
	{
		question: "What is blockchain verification?",
		answer: "Blockchain verification ensures that budget and transaction data cannot be altered or tampered with. Each entry receives a unique cryptographic hash stored on the blockchain. You can verify any record's authenticity by checking its hash against the blockchain ledger. This creates an immutable audit trail that builds public trust in government spending.",
	},
];

export default function FAQs() {
	const [open, setOpen] = React.useState<number | null>(null);
	const navigate = useNavigate();

	return (
		<div className="space-y-4">
			<div className="bg-white border border-slate-200 rounded-lg p-4">
				<div className="text-lg font-semibold">Frequently Asked Questions</div>
				<div className="mt-3 flex items-center gap-2">
					<input placeholder="Search FAQs..." className="h-9 w-full rounded border border-slate-300 px-3 text-sm"/>
					<select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All</option></select>
				</div>
			</div>

			<div className="bg-white border border-slate-200 rounded-lg divide-y">
				{faqData.map((faq, i) => (
					<details
						key={i}
						open={open === i}
						onToggle={(e) => setOpen(e.currentTarget.open ? i : null)}
						className="group"
					>
						<summary className="list-none cursor-pointer select-none p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
							<span className="text-sm font-medium text-slate-900">
								{faq.question}
							</span>
							<span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</span>
						</summary>
						<div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
							{faq.answer}
						</div>
					</details>
				))}
			</div>

			<div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
				<div className="text-sm font-medium">
					Can't find what you're looking for?
				</div>
				<div className="text-xs text-slate-600 mt-1">
					If you didn't find the answer to your question, reach out to our
					support team.
				</div>
				<button
					onClick={() => navigate("/agency/support")}
					className="mt-3 h-9 px-3 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
				>
					Contact Support
				</button>
			</div>
		</div>
	);
}