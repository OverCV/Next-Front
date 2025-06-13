// components\StatCard.tsx
import clsx from "clsx";
import Image from "next/image";
import { ReactNode } from "react";

type StatCardProps = {
  type: "postulada" | "ejecucion" | "finalizada";
  count: number;
  label: string;
  icon: string | ReactNode;
};

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-postulada": type === "postulada",
        "bg-ejecucion": type === "ejecucion",
        "bg-finalizada": type === "finalizada",
      })}
    >
      <div className="flex items-center gap-4">
        {typeof icon === "string" ? (
          <Image
            src={icon}
            height={32}
            width={32}
            alt={label}
            className="size-8 w-fit"
          />
        ) : (
          <div className="size-8 flex items-center justify-center text-black dark:text-white">
            {icon}
          </div>
        )}
        <h2 className="text-32-bold text-black dark:text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};
