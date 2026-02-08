import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p>Try again?</p>
      <Link href="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Back to Shop</Link>
    </div>
  );
}