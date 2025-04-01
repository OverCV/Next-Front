// src\lib\appwrite.config.ts
import * as sdk from "node-appwrite";

// Extraemos variables de entorno
export const {
  NEXT_PUBLIC_ENDPOINT,
  PROJECT_ID,
  API_KEY,
  NEXT_PUBLIC_BUCKET_ID,
} = process.env;

// Configuración del cliente principal de Appwrite
const client = new sdk.Client();

// Configurar cliente (asegurándonos que los valores existan)
client
  .setEndpoint(NEXT_PUBLIC_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

// Exportamos los servicios que necesitamos
export const messaging = new sdk.Messaging(client);