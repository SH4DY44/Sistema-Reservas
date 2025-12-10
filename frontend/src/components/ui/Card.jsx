import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "bg-brand-surface rounded-xl border border-slate-800/60 shadow-lg shadow-black/20 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("px-6 py-4 border-b border-slate-700/50", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn("font-bold text-white text-lg tracking-wide", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("p-6", className)} {...props}>
            {children}
        </div>
    );
}
