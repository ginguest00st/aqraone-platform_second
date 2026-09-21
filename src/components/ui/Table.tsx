import React from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
}

export default function Table<T extends object>({ columns, data, emptyMessage = "Tidak ada data", loading }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#E5E5E5]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8F8F6] border-b border-[#E5E5E5]">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[#6B6B6B]">
                <div className="inline-block w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[#6B6B6B] text-sm">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-[#F8F8F6] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-[#202020] ${col.className || ""}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
