"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function iniciarSesion() {
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensaje(error.message);
      return;
    }

    router.push("/inicio");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">CobroPina</h1>
          <p className="text-gray-500 mt-2">
            Controlá tus pagos fácilmente
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 bg-white text-black rounded-lg px-4 py-3 placeholder:text-gray-400 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 bg-white text-black rounded-lg px-4 py-3 placeholder:text-gray-400 outline-none focus:border-black"
            />
          </div>

          <button
            onClick={iniciarSesion}
            className="w-full bg-black text-white rounded-lg py-3 font-medium"
          >
            Iniciar sesión
          </button>

          {mensaje && (
            <p className="text-sm text-center text-red-600">
              {mensaje}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 pt-2">
            ¿No tenés una cuenta?{" "}
            <a href="/registro" className="text-black font-medium">
              Registrate
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}