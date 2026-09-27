"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";
import styles from "../../styles/registro.module.css";

export default function Registro() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function registrarse() {
    if (cargando) return;

    setMensaje("");
    setCargando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    setMensaje("¡Cuenta creada! Ya podés iniciar sesión.");
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>
            Empezá a usar CobroPina
          </p>
        </header>

        <div className={styles.form}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            className="button"
            onClick={registrarse}
            disabled={cargando}
          >
            {cargando ? "Creando..." : "Crear cuenta"}
          </button>

          {mensaje && (
            <p className={mensaje.startsWith("¡") ? "success" : "error"}>
              {mensaje}
            </p>
          )}
        </div>

        <p className={styles.footer}>
          ¿Ya tenés una cuenta?{" "}
          <a className="link" href="/">
            Iniciar sesión
          </a>
        </p>
      </div>
    </main>
  );
}