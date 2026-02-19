"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, impact, area_id, operation_type");
    if (!error) setLessons(data);
  }

  return (
    <main>
      <h1>Sistema de Lições Aprendidas</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            {lesson.title} – Impacto: {lesson.impact}
          </li>
        ))}
      </ul>
    </main>
  );
}
