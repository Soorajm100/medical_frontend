import Image from "next/image";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

import AuthPages from "@/components/login";
export default function Home() {

  
  const images = ['/profile.png', '/sun.png'];
  const partners = ["/sun.png", "/profile.png"];

  return (
    <div className="relative overflow-hidden">

      <AuthPages/>

    </div>
  );
}