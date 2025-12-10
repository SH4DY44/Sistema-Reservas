import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export function DataTable({
    columns,
    data,
    keyField = "id",
    searchPlaceholder = "Buscar...",
    onRowClick,
    isLoading = false
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter data
    const filteredData = data.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    if (isLoading) {
        return (
            <div className="w-full bg-brand-surface rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 overflow-hidden p-6 space-y-4">
                <div className="flex justify-between">
                    <div className="h-10 w-64 bg-slate-800/50 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 w-full bg-slate-800/30 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-brand-surface rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 overflow-hidden flex flex-col">
            {/* Header / Search */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2.5 bg-brand-dark border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700/50 bg-brand-dark/30">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {currentData.length > 0 ? (
                            currentData.map((item) => (
                                <tr
                                    key={item[keyField]}
                                    onClick={() => onRowClick && onRowClick(item)}
                                    className={cn(
                                        "hover:bg-brand-blue/5 transition-colors group",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td key={`${item[keyField]}-${col.key}`} className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap group-hover:text-white transition-colors">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">
                                    No se encontraron resultados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-700/50 flex items-center justify-between bg-brand-dark/30 mt-auto">
                <span className="text-sm text-slate-500">
                    Mostrando {Math.min(filteredData.length, startIndex + 1)} a {Math.min(filteredData.length, startIndex + itemsPerPage)} de {filteredData.length} resultados
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-300">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-400"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
