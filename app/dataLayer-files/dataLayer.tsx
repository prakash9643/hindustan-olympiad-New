"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function DataLayerEvents({ user }: { user?: any }) {
  useEffect(() => {
    // Safe user ID extraction    
    const userData = localStorage.getItem("user");
    console.log("User ID:", userData);
    console.log("Login Status:", userData ? "logged_in" : "logged_out");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      section_name: "hindustanolympiad",
      page_type: "hindustanolympiad",
      user_ID: userData ? "User" : "Guest",
      user_login_status: userData ? "logged_in" : "logged_out",
      data_source: "non_amp",
      domain_name: window.location.hostname,
    });
  }, [user]);

  return null;
}