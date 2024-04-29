'use client'
import DateSelector from "@/components/DateSelector/DateSelector";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DateSelector />
    </main>
  );
}
