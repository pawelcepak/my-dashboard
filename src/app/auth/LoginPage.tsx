import { Cloud, LoaderCircle, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/app/auth/useAuth';

const inputClasses =
  'h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 pl-10 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[var(--app-accent)] focus:ring-1 focus:ring-[var(--app-accent)]';

function getLoginErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Nie udało się zalogować.';
  }

  const normalizedMessage = error.message.toLowerCase();

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Nieprawidłowy adres e-mail lub hasło.';
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'Adres e-mail nie został potwierdzony.';
  }

  if (normalizedMessage.includes('failed to fetch')) {
    return 'Nie udało się połączyć z chmurą. Sprawdź internet.';
  }

  return error.message;
}

export default function LoginPage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-100">
      <main className="w-full max-w-md">
        <section className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70 shadow-2xl">
          <div className="border-b border-zinc-700 bg-zinc-950/45 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-[var(--app-accent-border)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
                <Cloud aria-hidden="true" className="size-5" />
              </div>

              <div>
                <p className="text-xl font-bold tracking-wide text-zinc-100">CHB</p>

                <p className="mt-0.5 text-xs text-zinc-500">Prywatna chmura danych</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-lg font-semibold text-zinc-100">Zaloguj się</h1>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Dostęp jest ograniczony do jednego prywatnego konta.
            </p>

            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className="mt-6 space-y-4"
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  E-mail
                </span>

                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Twój adres e-mail"
                    className={inputClasses}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Hasło
                </span>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Hasło"
                    className={inputClasses}
                  />
                </div>
              </label>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || email.trim() === '' || password === ''}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                    Logowanie…
                  </>
                ) : (
                  <>
                    <LogIn aria-hidden="true" className="size-4" />
                    Zaloguj
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950/40 px-4 py-3">
              <p className="text-xs leading-5 text-zinc-500">
                Dane nadal będą przechowywane lokalnie. Logowanie umożliwi uruchomienie prywatnej
                synchronizacji z Supabase.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
