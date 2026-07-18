"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { LogIn, ShieldCheck } from "lucide-react";

function SubmitBtn({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn btn-turquoise w-full text-lg disabled:opacity-50"
    >
      {pending ? "Connexion…" : "Se connecter"}
      <LogIn className="h-5 w-5" />
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});
  const [pin, setPin] = useState("");
  const pinRef = useRef<HTMLInputElement>(null);

  const cells = [0, 1, 2, 3];

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="label-field" htmlFor="login">
          Identifiant
        </label>
        <input
          id="login"
          name="login"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="ex : cadre"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="label-field">Code PIN (4 chiffres)</label>
        <input type="hidden" name="pin" value={pin} />
        <div
          className="flex gap-3 justify-center"
          onClick={() => pinRef.current?.focus()}
        >
          {cells.map((i) => (
            <div
              key={i}
              className={`h-16 w-14 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition ${
                pin.length === i
                  ? "border-turquoise-500 bg-turquoise-50"
                  : "border-ardoise-300 bg-white"
              }`}
            >
              {pin[i] ? "•" : ""}
            </div>
          ))}
        </div>
        <input
          ref={pinRef}
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          className="sr-only"
          aria-label="Code PIN"
        />
      </div>

      {state.error && (
        <p className="rounded-2xl bg-rouge-soft px-4 py-3 text-center font-semibold text-rouge">
          {state.error}
        </p>
      )}

      <SubmitBtn disabled={pin.length < 4} />

      <p className="flex items-center justify-center gap-2 text-sm text-ardoise-500">
        <ShieldCheck className="h-4 w-4" />
        Connexion sécurisée — données stockées localement
      </p>
    </form>
  );
}
