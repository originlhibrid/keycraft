import Image from "next/image";
import PasswordGenerator from "./components/PasswordGenerator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          KeyCraft Password Generator
        </h1>
        <PasswordGenerator />
      </main>
    </div>
  );
}
