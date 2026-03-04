export default function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass card p-6">
      <div className="font-extrabold">{title}</div>
      <div className="text-sm text-zinc-700 mt-1">{desc}</div>
    </div>
  );
}