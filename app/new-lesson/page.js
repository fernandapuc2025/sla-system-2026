"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function NewLesson() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("Médio");
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState(null);
  const [operationTypes, setOperationTypes] = useState([]);
  const [operationTypeId, setOperationTypeId] = useState(null);

  // Buscar áreas e tipos de operação do banco
  useEffect(() => {
    fetchAreas();
    fetchOperationTypes();
  }, []);

  async function fetchAreas() {
    const { data, error } = await supabase.from("areas").select("*");
    if (!error) {
      setAreas(data);
      setAreaId(data[0]?.id || null);
    }
  }

  async function fetchOperationTypes() {
    const { data, error } = await supabase.from("operation_types").select("*");
    if (!error) {
      setOperationTypes(data);
      setOperationTypeId(data[0]?.id || null);
    }
  }

  async function submitLesson(e) {
    e.preventDefault();
    const { error } = await supabase.from("lessons").insert([
      {
        title,
        description,
        impact,
        area_id: areaId,
        operation_type: operationTypeId,
      },
    ]);
    if (!error) alert("Lição criada com sucesso!");
  }

  return (
    <form onSubmit={submitLesson}>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={impact} onChange={(e) => setImpact(e.target.value)}>
        <option>Baixo</option>
        <option>Médio</option>
        <option>Alto</option>
      </select>
      <select value={areaId} onChange={(e) => setAreaId(Number(e.target.value))}>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <select
        value={operationTypeId}
        onChange={(e) => setOperationTypeId(Number(e.target.value))}
      >
        {operationTypes.map((op) => (
          <option key={op.id} value={op.id}>
            {op.name}
          </option>
        ))}
      </select>
      <button type="submit">Criar Lição</button>
    </form>
  );
}
