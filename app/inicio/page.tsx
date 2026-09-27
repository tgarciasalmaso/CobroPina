"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type Payment = {
  id: string;
  amount: number;
  paid_at: string;
  status: string;
};

export default function Inicio() {
  const supabase = createClient();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error(profileError);
        return;
      }

      setRole(profile.role);

      if (profile.role === "seller") {
        const { data, error } = await supabase
          .from("payments")
          .select("id, amount, paid_at, status")
          .eq("seller_id", user.id)
          .order("paid_at", { ascending: false });

        if (error) {
          console.error(error);
          return;
        }

        setPayments(data || []);
      }
    }

    cargarDatos();
  }, []);

  if (role === "seller") {
    return (
      <main>
        <h1>CobroPina</h1>
        <h2>Mis pagos</h2>

        {payments.length === 0 ? (
          <p>No hay pagos todavía.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id}>
              <strong>${payment.amount.toLocaleString("es-AR")}</strong>
              <p>
                {new Date(payment.paid_at).toLocaleString("es-AR")}
              </p>
              <p>✓ {payment.status}</p>
            </div>
          ))
        )}
      </main>
    );
  }

  return (
    <main>
      <h1>CobroPina</h1>
      <p>Panel del owner próximamente.</p>
    </main>
  );
}