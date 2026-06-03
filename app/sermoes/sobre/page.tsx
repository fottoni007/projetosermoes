import { BookOpen, Heart, Mail, PencilLine, Target, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SobrePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      {/* Aviso de rascunho — remover após revisão */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <PencilLine className="mt-0.5 shrink-0 text-amber-600" size={18} />
        <p className="text-sm text-amber-800">
          Este é um texto inicial de exemplo. Revê e edita livremente o conteúdo
          desta página para reflectir as tuas próprias palavras.
        </p>
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-olive">
          Servos Fiéis
        </p>
        <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
          Recursos úteis para a pregação
        </h1>
        <p className="mt-3 leading-7 text-ink/70">
          O <strong>Servos Fiéis</strong> nasce do desejo de servir a Igreja de Cristo,
          partilhando mensagens, estudos e recursos que edifiquem pregadores e
          fortaleçam o ministério da Palavra. Cremos que &ldquo;é necessário que os
          despenseiros sejam encontrados fiéis&rdquo; (1 Coríntios 4:2).
        </p>
      </div>

      {/* Quem somos */}
      <div className="mt-5 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
          <Users size={18} className="text-olive" />
          Quem somos
        </h2>
        <p className="mt-3 leading-7 text-ink/75">
          Somos uma comunidade de servos comprometidos com o ensino bíblico fiel e
          com a comunhão entre pregadores. Reunimos sermões, notas pastorais e
          materiais de apoio para que cada mensagem chegue preparada, fundamentada
          nas Escrituras e ao serviço do povo de Deus.
        </p>
      </div>

      {/* Sobre o pastor */}
      <div className="mt-5 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
          <Heart size={18} className="text-olive" />
          Sobre o Pastor Fabrício Ottoni
        </h2>
        <p className="mt-3 leading-7 text-ink/75">
          Pastor dedicado ao ensino da Palavra e ao cuidado das pessoas, Fabrício
          Ottoni tem procurado, ao longo do seu ministério, unir a profundidade
          bíblica à aplicação prática do Evangelho no dia a dia. O seu desejo é
          equipar outros pregadores e disponibilizar recursos que sirvam a Igreja.
        </p>
        <p className="mt-3 leading-7 text-ink/75">
          <span className="text-ink/50">[Espaço para a tua história pessoal: chamado
          ao ministério, formação, igreja onde serves, família e visão para o futuro.]</span>
        </p>
      </div>

      {/* Propósito */}
      <div className="mt-5 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
          <Target size={18} className="text-olive" />
          O propósito desta plataforma
        </h2>
        <ul className="mt-3 space-y-2 leading-7 text-ink/75">
          <li className="flex gap-2"><BookOpen size={18} className="mt-1 shrink-0 text-olive" /> Guardar e organizar sermões e mensagens pastorais.</li>
          <li className="flex gap-2"><BookOpen size={18} className="mt-1 shrink-0 text-olive" /> Pesquisar rapidamente por tema, texto bíblico ou série.</li>
          <li className="flex gap-2"><BookOpen size={18} className="mt-1 shrink-0 text-olive" /> Partilhar recursos entre pregadores fiéis.</li>
        </ul>
      </div>

      {/* Contacto */}
      <div className="mt-5 rounded-xl border border-olive/20 bg-olive/5 p-6 shadow-soft sm:p-8">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-olive">
          <Mail size={18} />
          Contacto
        </h2>
        <p className="mt-3 leading-7 text-ink/75">
          Para dúvidas, sugestões ou parcerias, escreve para{" "}
          <a className="font-semibold text-olive underline underline-offset-4" href="mailto:fottoni@icloud.com">
            fottoni@icloud.com
          </a>
          .
        </p>
      </div>

    </section>
  );
}
