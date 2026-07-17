import { motion } from "framer-motion";
import { X } from "lucide-react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-teal-600 text-white hover:bg-teal-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-1 block">{label}</span>}
      <input className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props} />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-1 block">{label}</span>}
      <select className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-1 block">{label}</span>}
      <textarea className={`min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props} />
    </label>
  );
}

export function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function StatCard({ icon: Icon, label, value, detail, tone = "blue" }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${tone === "teal" ? "bg-teal-100 text-teal-700 dark:bg-teal-950" : tone === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-950" : "bg-blue-100 text-blue-700 dark:bg-blue-950"}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
      {detail && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{detail}</p>}
    </Card>
  );
}

export function ProgressBar({ value, label }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500" />
      </div>
    </div>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button aria-label="Close modal" variant="ghost" className="px-2" onClick={onClose}><X size={18} /></Button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950" />
      <h3 className="font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function Skeleton() {
  return <div className="h-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />;
}
