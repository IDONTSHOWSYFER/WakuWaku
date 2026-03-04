const map: Record<string, string> = {
  WISHLIST: "border-pink-500/20 bg-pink-500/15 text-pink-700",
  OWNED: "border-emerald-500/20 bg-emerald-500/15 text-emerald-700",
  READING: "border-sky-500/20 bg-sky-500/15 text-sky-700",
  READ: "border-violet-500/20 bg-violet-500/15 text-violet-700",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span className={`text-xs font-extrabold rounded-full px-2.5 py-1 border ${map[status] ?? "bg-white/70 border-white/60 text-zinc-700"}`}>
      {status === "WISHLIST" ? "Wishlist" :
       status === "OWNED" ? "Possédé" :
       status === "READING" ? "En cours" :
       status === "READ" ? "Lu" : status}
    </span>
  );
}