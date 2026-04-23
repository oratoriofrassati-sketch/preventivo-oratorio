"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Calculator, Users, Euro, Plus, Minus, Send, Shirt } from "lucide-react";

const GENERAL_REGISTRATION_FEE = 30;
const EXTRA_SHIRT_FEE = 10;

const WEEKS = [
  {
    id: 1,
    label: "Settimana 1",
    period: "9-12 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 12,
    tripName: "Pian Sciresa",
    childTrip: 20,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 8,
    animatorTrip: 10,
  },
  {
    id: 2,
    label: "Settimana 2",
    period: "15-19 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 18,
    tripName: "Cornelle",
    childTrip: 25,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 12,
    animatorTrip: 12.5,
  },
  {
    id: 3,
    label: "Settimana 3",
    period: "22-26 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 18,
    tripName: "Acquatica",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 12,
    animatorTrip: 14,
  },
  {
    id: 4,
    label: "Settimana 4",
    period: "29 giugno-3 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 18,
    tripName: "Lago Moro",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 12,
    animatorTrip: 14,
  },
  {
    id: 5,
    label: "Settimana 5",
    period: "6-10 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 18,
    tripName: "Abbadia",
    childTrip: 20,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 12,
    animatorTrip: 10,
  },
  {
    id: 6,
    label: "Settimana 6",
    period: "13-16 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    childLunch: 12,
    tripName: "Parco sospeso",
    childTrip: 30,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 8,
    animatorTrip: 15,
  },
  {
    id: 7,
    label: "Settimana 7",
    period: "2-4 settembre",
    childBase: 10,
    childSecond: 10,
    childThirdPlus: 10,
    childPool: 0,
    childLunch: 12,
    tripName: "Acquaworld",
    childTrip: 25,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 8,
    animatorTrip: 12.5,
  },
  {
    id: 8,
    label: "Settimana 8",
    period: "7-11 settembre",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 0,
    childLunch: 24,
    tripName: "Volandia",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorLunch: 16,
    animatorTrip: 14,
  },
] as const;

type Selection = {
  weekId: number;
  enrolled: boolean;
  lunch: boolean;
  pool: boolean;
  trip: boolean;
};

type Row = {
  id: number;
  role: "figlio" | "animatore";
  name: string;
  extraShirt: boolean;
  selections: Selection[];
};

function createSelections(): Selection[] {
  return WEEKS.map((w) => ({
    weekId: w.id,
    enrolled: false,
    lunch: false,
    pool: false,
    trip: false,
  }));
}

function priceForChild(pos: number, w: (typeof WEEKS)[number]) {
  if (pos === 1) return w.childBase;
  if (pos === 2) return w.childSecond;
  return w.childThirdPlus;
}

function formatEuro(v: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(v);
}

function roleBadge(role: Row["role"]) {
  return role === "figlio"
    ? "bg-blue-100 text-blue-700 border-blue-200"
    : "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export default function App() {
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { id: 1, role: "figlio", name: "", extraShirt: false, selections: createSelections() },
  ]);

  const childIndex = useMemo(() => {
    let c = 0;
    return rows.map((r) => (r.role === "figlio" ? ++c : 0));
  }, [rows]);

  const computed = useMemo(
    () =>
      rows.map((r, i) => {
        const pos = childIndex[i];

        const details = r.selections.map((s) => {
          const w = WEEKS.find((x) => x.id === s.weekId)!;

          const base = s.enrolled
            ? r.role === "animatore"
              ? w.animatorBase
              : priceForChild(pos, w)
            : 0;

          const lunch = s.enrolled && s.lunch
            ? r.role === "animatore"
              ? w.animatorLunch
              : w.childLunch
            : 0;

          const pool = s.enrolled && s.pool
            ? r.role === "animatore"
              ? w.animatorPool
              : w.childPool
            : 0;

          const trip = s.enrolled && s.trip
            ? r.role === "animatore"
              ? w.animatorTrip
              : w.childTrip
            : 0;

          return {
            ...s,
            w,
            base,
            lunchAmount: lunch,
            poolAmount: pool,
            tripAmount: trip,
            total: base + lunch + pool + trip,
          };
        });

        const weeklyTotal = details.reduce((a, b) => a + b.total, 0);
        const registrationFee = GENERAL_REGISTRATION_FEE;
        const extraShirtFee = r.extraShirt ? EXTRA_SHIRT_FEE : 0;

        return {
          ...r,
          pos,
          details,
          registrationFee,
          extraShirtFee,
          weeklyTotal,
          displayName: r.name || (r.role === "figlio" ? `Figlio ${pos}` : "Animatore"),
          total: registrationFee + extraShirtFee + weeklyTotal,
        };
      }),
    [rows, childIndex]
  );

  const total = useMemo(() => computed.reduce((a, b) => a + b.total, 0), [computed]);

  function toggle(id: number, weekId: number, key: keyof Selection, value: boolean) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;

        return {
          ...row,
          selections: row.selections.map((s) => {
            if (s.weekId !== weekId) return s;
            const next = { ...s, [key]: value };
            if (!next.enrolled) {
              return { ...next, lunch: false, pool: false, trip: false };
            }
            return next;
          }),
        };
      })
    );
  }

  function add(role: "figlio" | "animatore") {
    const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows((current) => [
      ...current,
      { id, role, name: "", extraShirt: false, selections: createSelections() },
    ]);
  }

  function updateName(id: number, name: string) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, name } : row))
    );
  }

  function updateExtraShirt(id: number, value: boolean) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, extraShirt: value } : row))
    );
  }

  function removeRow(id: number) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  function buildEmailSummary() {
    const lines: string[] = [];
    lines.push("Preventivo Oratorio Estivo");
    lines.push("");
    if (email) lines.push(`Email: ${email}`);
    lines.push("");

    computed.forEach((participant) => {
      lines.push(
        `${participant.displayName}${
          participant.role === "figlio" ? ` (figlio n. ${participant.pos})` : " (animatore)"
        }`
      );
      lines.push(`- Quota generale iscrizione: ${formatEuro(participant.registrationFee)}`);
      if (participant.extraShirtFee > 0) {
        lines.push(`- Maglietta aggiuntiva: ${formatEuro(participant.extraShirtFee)}`);
      }

      participant.details
        .filter((d) => d.enrolled)
        .forEach((d) => {
          const extras = [
            d.lunch ? `mensa ${formatEuro(d.lunchAmount)}` : null,
            d.pool ? `piscina ${formatEuro(d.poolAmount)}` : null,
            d.trip ? `gita ${d.w.tripName} ${formatEuro(d.tripAmount)}` : null,
          ].filter(Boolean);

          lines.push(
            `- ${d.w.label} (${d.w.period}): quota ${formatEuro(d.base)}${
              extras.length ? `, ${extras.join(", ")}` : ""
            } → ${formatEuro(d.total)}`
          );
        });

      lines.push(`Totale ${participant.displayName}: ${formatEuro(participant.total)}`);
      lines.push("");
    });

    lines.push(`Totale complessivo: ${formatEuro(total)}`);
    return lines.join("\n");
  }

  async function sendQuoteEmail() {
    const res = await fetch("/api/send-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Preventivo Oratorio Estivo",
        text: buildEmailSummary(),
      }),
    });

    const data = await res.json();

    if (data.ok) {
      alert("Preventivo inviato correttamente!");
    } else {
      alert("Errore durante l'invio.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 p-4 text-slate-900 md:p-8" style={{ fontFamily: '"Trebuchet MS", "Avenir Next", "Segoe UI", sans-serif' }}>
      <div className="mx-auto max-w-7xl space-y-6">
<div className="space-y-4 text-center">
  <div className="flex justify-center">
    <img
      src="/logo-oratorio.png"
      alt="Logo Oratorio"
      className="h-32 w-auto object-contain md:h-40"
    />
  </div>

  <div className="space-y-2">
    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
      Preventivo Oratorio Estivo
    </h1>
    <p className="mx-auto max-w-3xl text-sm text-slate-600 md:text-base">
      Seleziona per ogni partecipante le settimane frequentate, i servizi collegati e le eventuali magliette aggiuntive.
      Mensa, piscina e gita si attivano solo se la settimana è stata selezionata.
    </p>
  </div>
</div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <Card className="rounded-3xl border-white/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5" />
                Composizione famiglia
              </CardTitle>
              <CardDescription>
                L&apos;ordine di inserimento dei figli determina automaticamente l&apos;applicazione dello sconto settimanale.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="genitore@email.it"
                  className="rounded-2xl"
                />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => add("figlio")} className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi figlio
                </Button>
                <Button variant="outline" onClick={() => add("animatore")} className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi animatore
                </Button>
              </div>

              <div className="space-y-5">
                {computed.map((r) => (
                  <div key={r.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{r.displayName}</h3>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${roleBadge(r.role)}`}>
                            {r.role === "figlio" ? `Figlio ${r.pos}` : "Animatore"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500">
                          {r.role === "figlio"
                            ? "Quota settimanale scontata in base all'ordine di inserimento."
                            : "Quota settimanale sempre pari a 0 €, con servizi dedicati."}
                        </p>

                        <div className="grid max-w-2xl gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${r.id}`}>
                              {r.role === "figlio" ? "Nome del figlio" : "Nome animatore"}
                            </Label>
                            <Input
                              id={`name-${r.id}`}
                              value={r.name}
                              onChange={(e) => updateName(r.id, e.target.value)}
                              placeholder={r.role === "figlio" ? "Es. Luca" : "Es. Marco"}
                              className="rounded-2xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Opzioni generali</Label>
                            <div className="rounded-2xl border bg-slate-50 p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span>Quota iscrizione generale</span>
                                <span className="font-semibold">{formatEuro(GENERAL_REGISTRATION_FEE)}</span>
                              </div>
                              <label className="mt-3 flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2">
                                  <Shirt className="h-4 w-4" />
                                  Maglietta aggiuntiva
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold">{formatEuro(EXTRA_SHIRT_FEE)}</span>
                                  <input
                                    type="checkbox"
                                    checked={r.extraShirt}
                                    onChange={(e) => updateExtraShirt(r.id, e.target.checked)}
                                    className="h-5 w-5 accent-blue-600"
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="rounded-2xl text-slate-500"
                        onClick={() => removeRow(r.id)}
                        disabled={rows.length === 1}
                      >
                        <Minus className="mr-2 h-4 w-4" />
                        Rimuovi
                      </Button>
                    </div>

                    <div className="mb-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                        <div className="text-slate-500">Quota iscrizione generale</div>
                        <div className="text-lg font-bold">{formatEuro(r.registrationFee)}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                        <div className="text-slate-500">Maglietta aggiuntiva</div>
                        <div className="text-lg font-bold">{formatEuro(r.extraShirtFee)}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                        <div className="text-slate-500">Totale settimane e servizi</div>
                        <div className="text-lg font-bold">{formatEuro(r.weeklyTotal)}</div>
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div className="space-y-3 md:hidden">
                      {r.details.map((d) => (
                        <div
                          key={d.weekId}
                          className={`rounded-2xl border p-3 ${d.enrolled ? "bg-slate-50" : "bg-white"}`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{d.w.label}</div>
                              <div className="text-xs text-slate-500">{d.w.period}</div>
                            </div>
                            <div className="font-semibold">{formatEuro(d.total)}</div>
                          </div>

                          <label className="flex items-center justify-between border-t py-2">
                            <span className="text-sm">Iscrizione</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">
                                {formatEuro(
                                  r.role === "animatore" ? d.w.animatorBase : priceForChild(r.pos, d.w)
                                )}
                              </span>
                              <input
                                type="checkbox"
                                checked={d.enrolled}
                                onChange={(e) => toggle(r.id, d.weekId, "enrolled", e.target.checked)}
                                className="h-5 w-5 accent-blue-600"
                              />
                            </div>
                          </label>

                          <label className={`flex items-center justify-between border-t py-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                            <span className="text-sm">Mensa</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{formatEuro(r.role === "animatore" ? d.w.animatorLunch : d.w.childLunch)}</span>
                              <input
                                type="checkbox"
                                disabled={!d.enrolled}
                                checked={d.lunch}
                                onChange={(e) => toggle(r.id, d.weekId, "lunch", e.target.checked)}
                                className="h-5 w-5 accent-blue-600"
                              />
                            </div>
                          </label>

                          <label className={`flex items-center justify-between border-t py-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                            <span className="text-sm">Piscina</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{formatEuro(r.role === "animatore" ? d.w.animatorPool : d.w.childPool)}</span>
                              <input
                                type="checkbox"
                                disabled={!d.enrolled}
                                checked={d.pool}
                                onChange={(e) => toggle(r.id, d.weekId, "pool", e.target.checked)}
                                className="h-5 w-5 accent-blue-600"
                              />
                            </div>
                          </label>

                          <label className={`flex items-center justify-between border-t py-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                            <span className="text-sm">{d.w.tripName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{formatEuro(r.role === "animatore" ? d.w.animatorTrip : d.w.childTrip)}</span>
                              <input
                                type="checkbox"
                                disabled={!d.enrolled}
                                checked={d.trip}
                                onChange={(e) => toggle(r.id, d.weekId, "trip", e.target.checked)}
                                className="h-5 w-5 accent-blue-600"
                              />
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-left text-slate-700">
                            <th className="px-3 py-3 font-semibold">Settimana</th>
                            <th className="px-3 py-3 font-semibold">Iscrizione</th>
                            <th className="px-3 py-3 font-semibold">Mensa</th>
                            <th className="px-3 py-3 font-semibold">Piscina</th>
                            <th className="px-3 py-3 font-semibold">Gita</th>
                            <th className="px-3 py-3 text-right font-semibold">Totale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.details.map((d) => (
                            <tr key={d.weekId} className={d.enrolled ? "bg-slate-50/80" : "bg-white"}>
                              <td className="border-t px-3 py-3 align-top">
                                <div className="font-medium">{d.w.label}</div>
                                <div className="text-xs text-slate-500">{d.w.period}</div>
                              </td>
                              <td className="border-t px-3 py-3 align-top">
                                <label className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    checked={d.enrolled}
                                    onChange={(e) => toggle(r.id, d.weekId, "enrolled", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">
                                      {formatEuro(
                                        r.role === "animatore" ? d.w.animatorBase : priceForChild(r.pos, d.w)
                                      )}
                                    </span>
                                    <span className="block text-xs text-slate-500">quota settimana</span>
                                  </span>
                                </label>
                              </td>
                              <td className="border-t px-3 py-3 align-top">
                                <label className={`flex items-start gap-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                                  <input
                                    type="checkbox"
                                    disabled={!d.enrolled}
                                    checked={d.lunch}
                                    onChange={(e) => toggle(r.id, d.weekId, "lunch", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">{formatEuro(r.role === "animatore" ? d.w.animatorLunch : d.w.childLunch)}</span>
                                    <span className="block text-xs text-slate-500">servizio mensa</span>
                                  </span>
                                </label>
                              </td>
                              <td className="border-t px-3 py-3 align-top">
                                <label className={`flex items-start gap-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                                  <input
                                    type="checkbox"
                                    disabled={!d.enrolled}
                                    checked={d.pool}
                                    onChange={(e) => toggle(r.id, d.weekId, "pool", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">{formatEuro(r.role === "animatore" ? d.w.animatorPool : d.w.childPool)}</span>
                                    <span className="block text-xs text-slate-500">ingresso piscina</span>
                                  </span>
                                </label>
                              </td>
                              <td className="border-t px-3 py-3 align-top">
                                <label className={`flex items-start gap-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                                  <input
                                    type="checkbox"
                                    disabled={!d.enrolled}
                                    checked={d.trip}
                                    onChange={(e) => toggle(r.id, d.weekId, "trip", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">{formatEuro(r.role === "animatore" ? d.w.animatorTrip : d.w.childTrip)}</span>
                                    <span className="block text-xs text-slate-500">{d.w.tripName}</span>
                                  </span>
                                </label>
                              </td>
                              <td className="border-t px-3 py-3 text-right align-top font-semibold">{formatEuro(d.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                        <div className="text-sm text-slate-500">Totale {r.displayName}</div>
                        <div className="text-lg font-bold">{formatEuro(r.total)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl shadow-sm lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-5 w-5" />
                  Riepilogo preventivo
                </CardTitle>
                <CardDescription>Totale aggiornato in tempo reale.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {computed.map((r) => {
                  const enrolledWeeks = r.details.filter((item) => item.enrolled).length;
                  const lunchCount = r.details.filter((item) => item.lunch).length;
                  const tripCount = r.details.filter((item) => item.trip).length;
                  const poolCount = r.details.filter((item) => item.pool).length;

                  return (
                    <div key={r.id} className="flex items-start justify-between gap-4 text-sm">
                      <div>
                        <div className="font-medium">{r.displayName}</div>
                        <div className="text-slate-500">
                          quota base {formatEuro(r.registrationFee)}
                          {r.extraShirtFee > 0 ? `, maglietta ${formatEuro(r.extraShirtFee)}` : ""}
                          <br />
                          {enrolledWeeks} sett., {lunchCount} mensa, {tripCount} gite, {poolCount} piscina
                        </div>
                      </div>
                      <div className="font-semibold">{formatEuro(r.total)}</div>
                    </div>
                  );
                })}

                <Separator />

                <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
                  <div>
                    <div className="text-sm text-slate-300">Totale complessivo</div>
                    <div className="text-2xl font-bold">{formatEuro(total)}</div>
                  </div>
                  <Euro className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mail className="h-5 w-5" />
                  Invio email
                </CardTitle>
                <CardDescription>
                  Il preventivo viene inviato automaticamente all&apos;indirizzo email inserito.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button className="w-full rounded-2xl" disabled={!email} onClick={sendQuoteEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Invia preventivo via email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
