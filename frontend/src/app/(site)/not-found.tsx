import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-teal-500">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-navy-500">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="mt-8 flex gap-3"><Link href="/" className="btn-primary">Go home</Link><Link href="/products" className="btn-outline">View products</Link></div>
    </section>
  );
}
