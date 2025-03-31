// components\StatCard.tsx
import clsx from "clsx";
import Image from "next/image";

type StatCardProps = {
  type: "postulada" | "ejecucion" | "cancelada";
  count: number;
  label: string;
  icon: string;
};

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-postulada": type === "postulada",
        "bg-ejecucion": type === "ejecucion",
        "bg-cancelada": type === "cancelada",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-black dark:text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};
