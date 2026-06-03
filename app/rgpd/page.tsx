import Link from "next/link";

export default function RgpdPage() {
  return (
    <main className="min-h-screen bg-linen px-6 py-10">
      <article className="mx-auto max-w-4xl rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-olive">
          Pastor Fabrício Ottoni
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">
          Termos de Privacidade e RGPD
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Última actualização: 3 de Junho de 2026
        </p>

        <div className="mt-8 space-y-8 text-ink/75">
          <section>
            <h2 className="text-xl font-semibold text-ink">1. Responsável pelo tratamento</h2>
            <p className="mt-3 leading-7">
              O responsável pelo tratamento dos dados pessoais nesta aplicação é o
              Pastor Fabrício Ottoni. Para dúvidas, pedidos ou exercício de direitos
              relacionados com privacidade e protecção de dados, deve ser usado o
              email:{" "}
              <a className="font-semibold text-olive underline underline-offset-4" href="mailto:fottoni@icloud.com">
                fottoni@icloud.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">2. Finalidade da aplicação</h2>
            <p className="mt-3 leading-7">
              Esta aplicação destina-se a organizar uma biblioteca interna de sermões,
              recursos pastorais e materiais úteis para pregadores. O acesso é feito
              através de conta pessoal, permitindo consultar sermões, pesquisar
              conteúdos e, quando autorizado, criar ou editar registos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">3. Dados pessoais tratados</h2>
            <p className="mt-3 leading-7">
              A aplicação pode tratar dados como email de acesso, data de criação da
              conta, registo de aceitação destes termos e conteúdos inseridos nos
              sermões, incluindo título, nome do pregador, texto bíblico, tema da
              série, notas e ficheiros PDF anexados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">4. Base e necessidade do tratamento</h2>
            <p className="mt-3 leading-7">
              Os dados são tratados para permitir o funcionamento da biblioteca,
              controlar o acesso de utilizadores, proteger conteúdos internos e manter
              os registos pastorais organizados. A criação de conta pressupõe a
              aceitação destes termos para que o utilizador possa aceder à aplicação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">5. Armazenamento e segurança</h2>
            <p className="mt-3 leading-7">
              Os dados são armazenados em serviços técnicos usados pela aplicação,
              nomeadamente Supabase para autenticação, base de dados e armazenamento
              de ficheiros. O acesso à aplicação é protegido por email e palavra-passe,
              e as permissões distinguem administradores de utilizadores com acesso de
              leitura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">6. Partilha de dados</h2>
            <p className="mt-3 leading-7">
              Os dados não são vendidos nem usados para marketing. Podem ser tratados
              por fornecedores técnicos necessários ao funcionamento da aplicação,
              sempre no âmbito de alojamento, autenticação, base de dados e
              armazenamento dos ficheiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">7. Conservação dos dados</h2>
            <p className="mt-3 leading-7">
              Os dados são conservados enquanto a conta estiver activa ou enquanto
              forem necessários para a organização da biblioteca de sermões. O
              utilizador pode solicitar a actualização, limitação ou eliminação dos
              seus dados quando aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">8. Direitos do utilizador</h2>
            <p className="mt-3 leading-7">
              Nos termos do RGPD, o utilizador pode solicitar informação sobre os seus
              dados, acesso, rectificação, eliminação, limitação do tratamento,
              oposição ao tratamento e portabilidade, quando estes direitos sejam
              aplicáveis. Os pedidos devem ser enviados para{" "}
              <a className="font-semibold text-olive underline underline-offset-4" href="mailto:fottoni@icloud.com">
                fottoni@icloud.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">9. Dúvidas e contacto</h2>
            <p className="mt-3 leading-7">
              Para qualquer dúvida sobre privacidade, protecção de dados ou utilização
              da aplicação, o contacto responsável é{" "}
              <a className="font-semibold text-olive underline underline-offset-4" href="mailto:fottoni@icloud.com">
                fottoni@icloud.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6">
          <Link className="text-sm font-semibold text-olive underline underline-offset-4" href="/login">
            Voltar ao acesso
          </Link>
        </div>
      </article>
    </main>
  );
}
