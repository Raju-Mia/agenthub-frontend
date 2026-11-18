import type { Metadata } from "next";
import { LandingHero } from "@/features/landing";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to Agent Hub — Lock App administration.",
};

export default function WelcomePage() {
  return <LandingHero />;
}
