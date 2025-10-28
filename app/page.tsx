"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, OutdentIcon } from "lucide-react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Import the HeroPanel component
import HeroPanel from "@/components/Heropanel";
import Panel2 from "@/components/Panel2";
import Panel3 from "@/components/Panel3";
import Panel4 from "@/components/Panel4";
import Panel5 from "@/components/Panel5";
import Panel6 from "@/components/Panel6";
import Panel7 from "@/components/Panel7";
import Panel8 from "@/components/Panel8";
import Panel9 from "@/components/Panel9";
import Panel10 from "@/components/Panel10";
import Panel11 from "@/components/Panel11";
import Panel12 from "@/components/Panel12";
import Panel13 from "@/components/Panel13";
import Panel14 from "@/components/Panel14";
import Panel15 from "@/components/Panel15";
import Panel152 from "@/components/Panel152";
import Panel16 from "@/components/Panel16";
import Footer from "@/components/Footer";



const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Panel */}
      <HeroPanel />
      <Panel2 />
      <Panel3 />
      <Panel4 />
      <Panel7 />
      <Panel5 />
      <Panel6 />
      <Panel8 />
      <Panel9 />
      <Panel10 />
      <Panel11 />
      <Panel12 />
      <Panel13 />
      <Panel14 />
      <Panel15 />
      <Panel16 />
      <Footer />
      {/* Placeholder for additional panels */}
      {/* Add new panels here as needed */}
    </div>
  );
};

export default Home;