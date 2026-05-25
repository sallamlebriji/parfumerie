import { motion } from "framer-motion";
import { ArrowDownUp, Search, SlidersHorizontal } from "lucide-react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

export const DataTable = ({ data, columns, filters, actions, emptyText = "Aucune donnee disponible." }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#D8B87E]/28 bg-[#FFFDF8] shadow-[0_22px_60px_rgba(82,55,37,0.09)]">
      <div className="flex flex-col gap-3 border-b border-[#D8B87E]/20 bg-[#FFF8EE] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B98D4B]" size={18} />
          <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher dans le tableau..." className="w-full rounded-[20px] border border-[#D8B87E]/30 bg-[#FFFDF8] py-3 pl-12 pr-4 text-sm font-semibold text-[#211817] outline-none transition placeholder:text-[#9E8C7E] focus:border-[#B98D4B] focus:bg-white focus:ring-4 focus:ring-[#D8B87E]/16" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters}
          {actions}
          <span className="inline-flex items-center gap-2 rounded-[20px] border border-[#D8B87E]/30 bg-[#FFFDF8] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#6F5A4A]">
            <SlidersHorizontal size={15} /> {table.getRowModel().rows.length} lignes
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-[#F6E7CA]">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>{group.headers.map((header) => <th key={header.id} className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#6F5A4A]">
                <button className="inline-flex items-center gap-2" onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <ArrowDownUp size={14} className="text-[#B98D4B]" />
                </button>
              </th>)}</tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#E8D7B9]">
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: Math.min(index * 0.015, 0.12) }}
                className="transition hover:bg-[#FFF5E7]"
              >
                {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-5 py-4 align-middle text-[#191713]">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
              </motion.tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm font-semibold text-[#8A8A8A]">{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
