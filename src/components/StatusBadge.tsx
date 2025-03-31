// components\StatusBadge.tsx
import clsx from "clsx";
import Image from "next/image";

import { Estatus } from "../types";
import { StatusIcon } from "../constants";

export const StatusBadge = ({ estatus }: { estatus: Estatus }) => {
  return (
    <div
      className={clsx("estatus-badge", {
        "bg-blue-600": estatus === "postulada",
        "bg-green-600": estatus === "ejecucion",
        "bg-red-600": estatus === "cancelada",
      })}
    >
      <Image
        src={StatusIcon[estatus]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-blue-500": estatus === "postulada",
          "text-green-500": estatus === "ejecucion",
          "text-red-500": estatus === "cancelada",
        })}
      >
        {estatus}
      </p>
    </div>
  );
};
