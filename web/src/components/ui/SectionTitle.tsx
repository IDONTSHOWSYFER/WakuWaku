export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        {subtitle ? <div className="text-sm text-zinc-600 mt-1">{subtitle}</div> : null}
      </div>
    </div>
  );
}