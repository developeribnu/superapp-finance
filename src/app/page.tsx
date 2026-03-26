import Link from "next/link";
import { navItems, superappInfo } from "@/data/navigation";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{superappInfo.name}</h1>
        <p className="text-gray-400">{superappInfo.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item, i) => (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className="group block p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
          >
            <h2 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
              {item.label}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Explore {item.label.toLowerCase()} resources and tools
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
