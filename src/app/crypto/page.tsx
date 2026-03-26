import Link from "next/link";

export default function CryptoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Crypto</h1>
        <p className="text-gray-400 mt-2">Hub for all Crypto related resources, tools, and content.</p>
      </div>

      <div className="grid gap-4">
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300">
            This section contains all resources related to Crypto.
            Browse through the available content, tools, and documentation.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-300">Content and documentation available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
