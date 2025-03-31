// src/components/PasskeyModal.tsx
"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";

// Función simple de encriptación/desencriptación
const encryptKey = (key: string): string => btoa(key);
const decryptKey = (encryptedKey: string): string => {
  try {
    return atob(encryptedKey);
  } catch (error) {
    console.error("Error al desencriptar clave:", error);
    return "";
  }
};

export const PasskeyModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  // Comprobar si debemos mostrar el modal al cargar
  // useEffect(() => {
  //   if (isAdmin) {
  //     const storedKey = localStorage.getItem("accessKey");
  //     const validKey = storedKey && decryptKey(storedKey) === process.env.NEXT_PUBLIC_ADMIN_PASSKEY;

  //     if (validKey) {
  //       // Si ya tiene la clave correcta, redirigir
  //       router.push("/admin");
  //     } else {
  //       // Si no, mostrar el modal
  //       setOpen(true);
  //     }
  //   } else {
  //     setOpen(false);
  //   }
  // }, [isAdmin, router]);

  const closeModal = () => {
    setOpen(false);
    router.push("/acceso");
  };

  const validatePasskey = () => {
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "111111";

    if (passkey === adminPass) {
      localStorage.setItem("accessKey", encryptKey(passkey));
      setOpen(false);
      router.push("/admin");
    } else {
      setError("Código de acceso inválido. Por favor, inténtelo de nuevo.");
    }
  };

  // if (!isAdmin) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="z-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Verificación de Acceso Administrativo
            <button onClick={closeModal} className="cursor-pointer">
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
              />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Para acceder a la página de administrador, ingrese el código de acceso.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={validatePasskey}
            className="w-full"
          >
            Ingresar Código de Administrador
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};