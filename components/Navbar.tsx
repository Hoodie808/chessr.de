import Link from "next/link";
import Image from "next/image";


export default function Navbar() {
return (
<nav className="w-full flex items-center justify-between p-4 border-b">
<Link href="/" className="flex items-center space-x-2">
<Image src="/logo.svg" alt="Logo" width={40} height={40} />
<span className="font-bold text-xl">ChessR</span>
</Link>
<div className="space-x-6 text-lg">
<Link href="/">Home</Link>
<Link href="/play">Play</Link>
<Link href="/about">About</Link>
<Link href="/contact">Contact</Link>
</div>
</nav>
);
}