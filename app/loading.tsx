import { Bell } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-neutral-950">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-indigo-400 animate-pulse" />
        <span className="text-lg font-bold text-white">Notifything</span>
      </div>
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
