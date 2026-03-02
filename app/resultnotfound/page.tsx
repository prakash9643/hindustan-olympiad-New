import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeIcon, NotebookText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const ResultNotFound = () => {
    return (
			<div className="container flex h-screen w-full flex-col items-center">
				<Card className="w-full max-w-5xl text-center border-none">
					<CardHeader>
							<CardTitle className="text-[26px] font-bold text-primary">We recognise that you have been experiencing trouble while trying to check your Hindustan Olympiad 2025 result. In order to help you access your result, we need to capture some details</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="text-black text-md list-inside text-left gap-12 md:flex md:justify-center">
							<li>1) Student and parent details</li>
							<li>2) OMR Sheet Unique Code</li>
							<li>3) Acknowledgement slip image</li>
						</ul>
						<p className="text-[#374151] font-bold text-lg mt-8">
							Below we have showcased the OMR sheet, to help you identify the Unique OMR Sheet code and Acknowledgment slip
						</p>
						<Image src="/images/navbar/omr-sheet.png" alt="OMR Sample" width={600} height={400} className="mx-auto mt-6" />
					</CardContent>
					<CardFooter className="flex justify-center">
						<Button asChild>
							<Link href="https://forms.gle/AnUHizhj66ThPTe5A" target="_blank">
								<NotebookText className="mr-2 h-4 w-4" />
								Share Details to Proceed
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
    )
}

export default ResultNotFound