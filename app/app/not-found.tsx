import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="container flex h-screen w-full flex-col items-center justify-center">
            <Card className="w-full max-w-md text-center border-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">404</CardTitle>
                    <CardDescription className="text-black font-bold test-base text-xl">Page not found</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Oops! The page you{"'"}re looking for seems to have wandered off into the digital wilderness. Please try again.
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

export default NotFound