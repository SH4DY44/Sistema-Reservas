import { Card, CardContent } from "./Card";
import { cn } from "../../utils/cn";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export function StatsCard({ title, value, trend, trendValue, icon: Icon, className }) {
    const isPositive = trend === "up";
    const isNeutral = trend === "neutral";

    return (
        <Card className={cn("relative overflow-hidden group hover:border-brand-blue/30 transition-colors", className)}>
            {/* Glow Effect on Hover */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
                <div className="w-24 h-24 bg-brand-blue blur-3xl rounded-full"></div>
            </div>

            <CardContent className="p-6 flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
                    <h4 className="text-3xl font-bold text-white mt-2">{value}</h4>

                    {(trendValue || trend) && (
                        <div className="flex items-center mt-3">
                            {!isNeutral && (
                                <span
                                    className={cn(
                                        "flex items-center text-xs font-bold px-2 py-1 rounded-md border",
                                        isPositive
                                            ? "text-brand-blue bg-blue-500/10 border-blue-500/20"
                                            : "text-brand-orange bg-orange-500/10 border-orange-500/20"
                                    )}
                                >
                                    {isPositive ? (
                                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                                    ) : (
                                        <ArrowDownIcon className="w-3 h-3 mr-1" />
                                    )}
                                    {trendValue}
                                </span>
                            )}
                            {isNeutral && trendValue && (
                                <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded">{trendValue}</span>
                            )}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
