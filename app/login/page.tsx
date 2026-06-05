import { LogIn, UserPlus } from "lucide-react";
import { signIn, signUp } from "@/app/login/actions";
import { hasSupabaseConfig } from "@/lib/config";

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
    registo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const loginError = params.erro
    ? decodeURIComponent(params.erro)
    : "";
  const signUpMessage = params.registo
    ? decodeURIComponent(params.registo)
    : "";

  const readableSignUpMessage =
    signUpMessage === "conta-criada"
      ? "Conta criada. Se a confirmação por email estiver activa no Supabase, confirma o email antes de entrar."
      : signUpMessage === "palavra-passe-curta"
        ? "A palavra-passe deve ter pelo menos 6 caracteres."
        : signUpMessage === "palavras-passe-diferentes"
          ? "As palavras-passe não coincidem."
          : signUpMessage === "rgpd-obrigatorio"
            ? "É necessário ler e aceitar os termos de privacidade e RGPD para criar conta."
          : signUpMessage;

  return (
    <main className="min-h-screen bg-linen px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-olive">
            Servos Fiéis
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Recursos úteis para a pregação</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Acesso interno para guardar, pesquisar e consultar mensagens pastorais e outros recursos.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <form action={signIn} className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-ink">Entrar</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Usa o email e a palavra-passe da tua conta.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-ink">Email</span>
                <input
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink">Palavra-passe</span>
                <input
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            {loginError ? (
              <p className="mt-4 rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">
                Não foi possível iniciar sessão: {loginError}
              </p>
            ) : null}

            {!hasSupabaseConfig() ? (
              <p className="mt-4 rounded-md bg-olive/10 px-3 py-2 text-sm text-olive">
                Configura as variáveis do Supabase antes de iniciar sessão.
              </p>
            ) : null}

            <button
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90"
              type="submit"
            >
              <LogIn size={18} />
              Entrar
            </button>
          </form>

          <form action={signUp} className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-ink">Criar conta</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Cria um novo acesso para a equipa interna.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-ink">Email</span>
                <input
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                  name="new-email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink">Palavra-passe</span>
                <input
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink">Confirmar palavra-passe</span>
                <input
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <label className="flex items-start gap-3 rounded-md border border-ink/10 bg-mist/35 p-3 text-sm leading-6 text-ink/75">
                <input
                  className="mt-1 h-4 w-4 rounded border-ink/20 text-olive focus:ring-olive"
                  name="accepts-rgpd"
                  type="checkbox"
                  required
                />
                <span>
                  Li e concordo com os{" "}
                  <a
                    className="font-semibold text-olive underline underline-offset-4"
                    href="/rgpd"
                    target="_blank"
                    rel="noreferrer"
                  >
                    termos de privacidade e RGPD
                  </a>
                  .
                </span>
              </label>
            </div>

            {readableSignUpMessage ? (
              <p className="mt-4 rounded-md bg-olive/10 px-3 py-2 text-sm text-olive">
                {readableSignUpMessage}
              </p>
            ) : null}

            <button
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-clay/90"
              type="submit"
            >
              <UserPlus size={18} />
              Criar conta
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
