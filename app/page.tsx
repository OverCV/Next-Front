// app\page.tsx
import { redirect } from "next/navigation";

import { parametrosBusquedaProps } from "@/src/types";

const Home = ({ paramsBusqueda }: parametrosBusquedaProps) => {
  redirect("/acceso")
}

export default Home;


