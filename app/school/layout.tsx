"use client"
import React, { use, useEffect, useState } from 'react'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link';
import { usePathname , useRouter } from 'next/navigation';


const tabs = [
    { label: 'School Details', href: '/school/dashboard' },
    { label: 'Add Student', href: '/school/add-student' },
    { label: 'View Students', href: '/school/view-students' },
    { label: 'Bulk Add Students', href: '/school/bulk-add-students' },
]

export default function SchoolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if(localStorage.getItem("user")) {
            console.log(localStorage.getItem("user"));
        } else {
            router.push("/phone-login/school");
        }
    }, [pathname]);

    return (
        <div className='max-w-7xl mx-auto px-4 pt-10'>
            <CardHeader className='p-0'>
                <CardTitle>School dashboard</CardTitle>
                <CardDescription>Manage students and school data with comprehensive forms and data views</CardDescription>
            </CardHeader>

            <div className="inline-flex md:h-10 rounded-md bg-muted p-1 text-muted-foreground mt-4 mb-4 flex-wrap">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${ pathname === tab.href
                            ? 'bg-primary text-white'
                            : ''
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {children}
        </div>
    )
}
