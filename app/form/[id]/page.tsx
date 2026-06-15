"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { EMPTY_FORM } from "@/lib/types";

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    const id = params.id as string;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      const { data: form } = await supabase.from("design_forms").select("*").eq("id", id).single();
      if (!form) { router.push("/dashboard"); return; }
      // Redirect to new form page with pre-loaded data via sessionStorage
      sessionStorage.setItem("edit_form_id", id);
      sessionStorage.setItem("edit_form_data", JSON.stringify({ ...EMPTY_FORM, ...form.form_data }));
      router.push("/form/new?edit=" + id);
    });
  }, []);

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <p style={{ color:"var(--text-muted)" }}>설계서 불러오는 중...</p>
    </div>
  );
}
