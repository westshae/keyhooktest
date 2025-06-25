import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>This page is purely so you can navigate to the endpoints easier, this would not be in production.</h1>
      <nav className="flex gap-6 text-sm">
        <Link href="/availability" className="hover:underline">
          Availability
        </Link>
        <Link href="/book" className="hover:underline">
          Book
        </Link>
      </nav>
    </div>
  );
}
