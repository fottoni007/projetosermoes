import type { MetadataRoute } from "next";

// App interna (todo o conteúdo está atrás de autenticação) — não deve ser
// indexada por motores de busca. As pré-visualizações de partilha (Open Graph)
// continuam a funcionar, pois são lidas diretamente pelos clientes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
