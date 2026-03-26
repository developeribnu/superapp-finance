"use client";

interface ComparisonItem {
  name: string;
  return: string;
  risk: string;
  minInvest: string;
  tax: string;
  liquidity: string;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
}

const headers = [
  { key: "name", label: "Instrumen" },
  { key: "return", label: "Return" },
  { key: "risk", label: "Risiko" },
  { key: "minInvest", label: "Min. Investasi" },
  { key: "tax", label: "Pajak" },
  { key: "liquidity", label: "Likuiditas" },
] as const;

export function ComparisonTable({ items }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h.key}
                className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700"
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {item.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{item.return}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{item.risk}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{item.minInvest}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{item.tax}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{item.liquidity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
