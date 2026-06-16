import { ShieldCheck, BookOpen, GraduationCap } from "lucide-react";

const roles = [
  { label: "Admin", icon: ShieldCheck },
  { label: "Dosen", icon: BookOpen },
  { label: "Mahasiswa", icon: GraduationCap },
] as const;

export function HeroBadge() {
  return (
    <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm px-1.5 py-1.5">
      {roles.map(({ label, icon: Icon }, i) => (
        <span key={label} className="inline-flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-medium text-neutral-400">
            <Icon className="h-3 w-3 text-purple-500" />
            {label}
          </span>
          {i < roles.length - 1 && (
            <span className="w-px h-3 bg-neutral-700" />
          )}
        </span>
      ))}
    </div>
  );
}