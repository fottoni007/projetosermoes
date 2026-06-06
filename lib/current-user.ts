import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Utilizador autenticado, memoizado por pedido com `cache()` do React.
 *
 * Várias partes do render (layout, página e funções de dados em lib/) precisam
 * do utilizador atual. Sem memoização, cada uma chamava `auth.getUser()` — uma
 * ida-e-volta à rede de validação do Supabase — 5 a 8 vezes por carregamento.
 * Com `cache()`, todas as chamadas dentro do mesmo pedido reutilizam uma só.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
