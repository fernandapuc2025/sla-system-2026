import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse-fork';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // 1. Extração do Texto do PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    
    // 2. Chamada à IA (Gemini)
    const rawAnalysis = await analisarDocumento(pdfData.text);
    const data = JSON.parse(rawAnalysis);

    // --- OPERAÇÃO DE BANCO DE DADOS EM CADEIA ---

    // 3. Lógica para Missão (Busca ou Criação manual para evitar o erro de ON CONFLICT)
    let missao;
    const { data: existente } = await supabase
      .from('missoes')
      .select('*')
      .eq('nome_missao', data.missao.nome_missao)
      .maybeSingle();

    if (existente) {
      missao = existente;
    } else {
      const { data: nova, error: mErr } = await supabase
        .from('missoes')
        .insert([{ 
          nome_missao: data.missao.nome_missao,
          tipo_operacao: data.missao.tipo_operacao,
          teatro_local: data.missao.teatro_local,
          status: data.missao.status 
        }])
        .select()
        .single();
      
      if (mErr) throw new Error(`Erro na Missão: ${mErr.message}`);
      missao = nova;
    }

    // 4. Inserir Relato Operacional
    const { error: rErr } = await supabase.from('relatos_operacionais').insert([{
      missao_id: missao.id,
      titulo_relato: data.relato.titulo_relato,
      descricao_evento: data.relato.descricao_evento,
      pontuacao_friccao: data.relato.pontuacao_friccao,
      nivel_decisorio_afetado: data.relato.nivel_decisorio_afetado,
      severidade_percebida: data.relato.severidade_percebida,
      natureza_impacto: data.relato.natureza_impacto || []
    }]);
    if (rErr) throw new Error(`Erro no Relato: ${rErr.message}`);

    // 5. Inserir Lição Aprendida
    const { error: lErr } = await supabase.from('licoes_aprendidas').insert([{
      missao_id: missao.id,
      titulo_licao: data.licao
