import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SamplePapers = () => {
return (
		<div className="container flex h-screen w-full flex-col items-center justify-center">
				<Card className="w-full max-w-md text-center border-none">
						<CardHeader>
								<CardTitle className="text-3xl font-bold">Coming Soon</CardTitle>
						</CardHeader>
						<CardContent>
								<img src="/images/panel5/exam-image.jpg" alt="Sample Papers" className="w-full max-w-sm h-auto object-cover rounded-md" />

								<p className="text-muted-foreground text-sm mt-4">
										Oops! Sample papers are not available yet. Please try again later.
								</p>
						</CardContent>
						<CardFooter className="flex justify-center">
								<Button asChild>
										<Link href="/">
												<HomeIcon className="mr-2 h-4 w-4" />
												Return Home
										</Link>
								</Button>
						</CardFooter>
				</Card>
		</div>
)
}

export default SamplePapers