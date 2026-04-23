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
const CHILD_LUNCH_DAY_FEE = 6;
const ANIMATOR_LUNCH_DAY_FEE = 4;

const WEEKS = [
  {
    id: 1,
    label: "Settimana 1",
    shortBadge: "S1",
    period: "9-12 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita a Pian Sciresa",
    childTrip: 20,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 10,
    lunchDays: ["Martedì 9 giugno", "Giovedì 11 giugno"],
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 2,
    label: "Settimana 2",
    shortBadge: "S2",
    period: "15-19 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita alle Cornelle",
    childTrip: 25,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 12.5,
    lunchDays: ["Lunedì 15 giugno", "Mercoledì 17 giugno", "Venerdì 19 giugno"],
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: 3,
    label: "Settimana 3",
    shortBadge: "S3",
    period: "22-26 giugno",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita ad Acquatica",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 14,
    lunchDays: ["Lunedì 22 giugno", "Mercoledì 24 giugno", "Venerdì 26 giugno"],
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: 4,
    label: "Settimana 4",
    shortBadge: "S4",
    period: "29 giugno-3 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita al Lago Moro",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 14,
    lunchDays: ["Lunedì 29 giugno", "Mercoledì 1 luglio", "Venerdì 3 luglio"],
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: 5,
    label: "Settimana 5",
    shortBadge: "S5",
    period: "6-10 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita ad Abbadia",
    childTrip: 20,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 10,
    lunchDays: ["Lunedì 6 luglio", "Mercoledì 8 luglio", "Venerdì 10 luglio"],
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    id: 6,
    label: "Settimana 6",
    shortBadge: "S6",
    period: "13-16 luglio",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 18,
    tripName: "Gita al Parco sospeso",
    childTrip: 30,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 15,
    lunchDays: ["Lunedì 13 luglio", "Mercoledì 15 luglio"],
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: 7,
    label: "Settimana 7",
    shortBadge: "S7",
    period: "2-4 settembre",
    childBase: 10,
    childSecond: 10,
    childThirdPlus: 10,
    childPool: 0,
    tripName: "Gita ad Acquaworld",
    childTrip: 25,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 12.5,
    lunchDays: ["Mercoledì 2 settembre", "Venerdì 4 settembre"],
    color: "bg-cyan-50 border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    id: 8,
    label: "Settimana 8",
    shortBadge: "S8",
    period: "7-11 settembre",
    childBase: 15,
    childSecond: 10,
    childThirdPlus: 5,
    childPool: 0,
    tripName: "Gita a Volandia",
    childTrip: 28,
    animatorBase: 0,
    animatorPool: 10,
    animatorTrip: 14,
    lunchDays: [
      "Lunedì 7 settembre",
      "Mercoledì 9 settembre",
      "Giovedì 10 settembre",
      "Venerdì 11 settembre",
    ],
    color: "bg-lime-50 border-lime-200",
    badge: "bg-lime-100 text-lime-700 border-lime-200",
  },
] as const;

type Selection = {
  weekId: number;
  enrolled: boolean;
  selectedLunchDays: string[];
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
    selectedLunchDays: [],
    pool: false,
    trip: false,
  }));
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

  const computed = useMemo(() => {
    return rows.map((r, rowIndex) => {
      const details = r.selections.map((s) => {
        const w = WEEKS.find((x) => x.id === s.weekId)!;

        let base = 0;

        if (s.enrolled) {
          if (r.role === "animatore") {
            base = w.animatorBase;
          } else {
            const enrolledChildrenIndexes = rows
              .map((row, idx) => ({ row, idx }))
              .filter(({ row }) => row.role === "figlio")
              .filter(({ row }) => {
                const weekSelection = row.selections.find((sel) => sel.weekId === s.weekId);
                return weekSelection?.enrolled === true;
              })
              .map(({ idx }) => idx);

            const siblingPositionForThisWeek = enrolledChildrenIndexes.indexOf(rowIndex) + 1;

            if (siblingPositionForThisWeek <= 0) {
              base = w.childBase;
            } else if (s.weekId === 7) {
              base = w.childBase;
            } else if (siblingPositionForThisWeek === 1) {
              base = w.childBase;
            } else if (siblingPositionForThisWeek === 2) {
              base = w.childSecond;
            } else {
              base = w.childThirdPlus;
            }
          }
        }

        const lunch = s.enrolled
          ? s.selectedLunchDays.length *
            (r.role === "animatore" ? ANIMATOR_LUNCH_DAY_FEE : CHILD_LUNCH_DAY_FEE)
          : 0;

        const pool =
          s.enrolled && s.pool
            ? r.role === "animatore"
              ? w.animatorPool
              : w.childPool
            : 0;

        const trip =
          s.enrolled && s.trip
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

      const globalChildPosition =
        r.role === "figlio"
          ? rows.slice(0, rowIndex + 1).filter((row) => row.role === "figlio").length
          : 0;

      return {
        ...r,
        pos: globalChildPosition,
        details,
        registrationFee,
        extraShirtFee,
        weeklyTotal,
        displayName: r.name || (r.role === "figlio" ? `Figlio ${globalChildPosition}` : "Animatore"),
        total: registrationFee + extraShirtFee + weeklyTotal,
      };
    });
  }, [rows]);

  const total = useMemo(() => computed.reduce((a, b) => a + b.total, 0), [computed]);

  function toggle(id: number, weekId: number, key: "enrolled" | "pool" | "trip", value: boolean) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;

        return {
          ...row,
          selections: row.selections.map((s) => {
            if (s.weekId !== weekId) return s;
            const next = { ...s, [key]: value };

            if (!next.enrolled) {
              return { ...next, selectedLunchDays: [], pool: false, trip: false };
            }

            return next;
          }),
        };
      })
    );
  }

  function toggleLunchDay(id: number, weekId: number, day: string) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;

        return {
          ...row,
          selections: row.selections.map((s) => {
            if (s.weekId !== weekId) return s;
            if (!s.enrolled) return s;

            const exists = s.selectedLunchDays.includes(day);

            return {
              ...s,
              selectedLunchDays: exists
                ? s.selectedLunchDays.filter((d) => d !== day)
                : [...s.selectedLunchDays, day],
            };
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
          const extras: string[] = [];

          if (d.selectedLunchDays.length > 0) {
            extras.push(`mensa (${d.selectedLunchDays.join(", ")}) ${formatEuro(d.lunchAmount)}`);
          }

          if (d.pool) {
            extras.push(`piscina ${formatEuro(d.poolAmount)}`);
          }

          if (d.trip) {
            extras.push(`${d.w.tripName} ${formatEuro(d.tripAmount)}`);
          }

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
    <div
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 p-4 text-slate-900 md:p-8"
      style={{ fontFamily: '"Trebuchet MS", "Avenir Next", "Segoe UI", sans-serif' }}
    >
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
                Lo sconto fratelli si applica solo ai figli iscritti nella stessa settimana.
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
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${roleBadge(
                              r.role
                            )}`}
                          >
                            {r.role === "figlio" ? `Figlio ${r.pos}` : "Animatore"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500">
                          {r.role === "figlio"
                            ? "La quota settimanale dipende dai fratelli presenti in quella stessa settimana."
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
                          className={`rounded-2xl border p-3 ${d.w.color}`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <div className="mb-1 flex items-center gap-2">
                                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${d.w.badge}`}>
                                  {d.w.shortBadge}
                                </span>
                                <div className="font-semibold">{d.w.label}</div>
                              </div>
                              <div className="text-xs text-slate-500">{d.w.period}</div>
                            </div>
                            <div className="font-semibold">{formatEuro(d.total)}</div>
                          </div>

                          <label className="flex items-center justify-between border-t py-2">
                            <span className="text-sm">Iscrizione</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{formatEuro(d.base)}</span>
                              <input
                                type="checkbox"
                                checked={d.enrolled}
                                onChange={(e) => toggle(r.id, d.weekId, "enrolled", e.target.checked)}
                                className="h-5 w-5 accent-blue-600"
                              />
                            </div>
                          </label>

                          {d.enrolled && (
                            <div className="border-t py-2">
                              <div className="mb-2 text-sm font-medium">
                                Mensa ({r.role === "animatore" ? formatEuro(ANIMATOR_LUNCH_DAY_FEE) : formatEuro(CHILD_LUNCH_DAY_FEE)} al giorno)
                              </div>
                              <div className="space-y-2">
                                {d.w.lunchDays.map((day) => (
                                  <label key={day} className="flex items-center justify-between gap-3 text-sm">
                                    <span>{day}</span>
                                    <input
                                      type="checkbox"
                                      checked={d.selectedLunchDays.includes(day)}
                                      onChange={() => toggleLunchDay(r.id, d.weekId, day)}
                                      className="h-5 w-5 accent-blue-600"
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          <label className={`flex items-center justify-between border-t py-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                            <span className="text-sm">Piscina</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {formatEuro(r.role === "animatore" ? d.w.animatorPool : d.w.childPool)}
                              </span>
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
                              <span className="text-sm">
                                {formatEuro(r.role === "animatore" ? d.w.animatorTrip : d.w.childTrip)}
                              </span>
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
                      <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-left text-slate-700">
                            <th className="rounded-l-2xl px-3 py-3 font-semibold">Settimana</th>
                            <th className="px-3 py-3 font-semibold">Iscrizione</th>
                            <th className="px-3 py-3 font-semibold">Mensa</th>
                            <th className="px-3 py-3 font-semibold">Piscina</th>
                            <th className="px-3 py-3 font-semibold">Gita</th>
                            <th className="rounded-r-2xl px-3 py-3 text-right font-semibold">Totale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.details.map((d) => (
                            <tr key={d.weekId} className="align-top">
                              <td className={`rounded-l-2xl border px-3 py-3 ${d.w.color}`}>
                                <div className="mb-1 flex items-center gap-2">
                                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${d.w.badge}`}>
                                    {d.w.shortBadge}
                                  </span>
                                  <div className="font-medium">{d.w.label}</div>
                                </div>
                                <div className="text-xs text-slate-500">{d.w.period}</div>
                              </td>

                              <td className={`border px-3 py-3 ${d.w.color}`}>
                                <label className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    checked={d.enrolled}
                                    onChange={(e) => toggle(r.id, d.weekId, "enrolled", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">{formatEuro(d.base)}</span>
                                    <span className="block text-xs text-slate-500">quota settimana</span>
                                  </span>
                                </label>
                              </td>

                              <td className={`border px-3 py-3 ${d.w.color}`}>
                                {d.enrolled ? (
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium text-slate-600">
                                      {r.role === "animatore"
                                        ? `${formatEuro(ANIMATOR_LUNCH_DAY_FEE)} al giorno`
                                        : `${formatEuro(CHILD_LUNCH_DAY_FEE)} al giorno`}
                                    </div>
                                    {d.w.lunchDays.map((day) => (
                                      <label key={day} className="flex items-center justify-between gap-3 text-sm">
                                        <span>{day}</span>
                                        <input
                                          type="checkbox"
                                          checked={d.selectedLunchDays.includes(day)}
                                          onChange={() => toggleLunchDay(r.id, d.weekId, day)}
                                          className="h-5 w-5 accent-blue-600"
                                        />
                                      </label>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-400">Attiva prima la settimana</div>
                                )}
                              </td>

                              <td className={`border px-3 py-3 ${d.w.color}`}>
                                <label className={`flex items-start gap-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                                  <input
                                    type="checkbox"
                                    disabled={!d.enrolled}
                                    checked={d.pool}
                                    onChange={(e) => toggle(r.id, d.weekId, "pool", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">
                                      {formatEuro(r.role === "animatore" ? d.w.animatorPool : d.w.childPool)}
                                    </span>
                                    <span className="block text-xs text-slate-500">ingresso piscina</span>
                                  </span>
                                </label>
                              </td>

                              <td className={`border px-3 py-3 ${d.w.color}`}>
                                <label className={`flex items-start gap-2 ${!d.enrolled ? "opacity-40" : ""}`}>
                                  <input
                                    type="checkbox"
                                    disabled={!d.enrolled}
                                    checked={d.trip}
                                    onChange={(e) => toggle(r.id, d.weekId, "trip", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                  />
                                  <span>
                                    <span className="block font-medium">
                                      {formatEuro(r.role === "animatore" ? d.w.animatorTrip : d.w.childTrip)}
                                    </span>
                                    <span className="block text-xs text-slate-500">{d.w.tripName}</span>
                                  </span>
                                </label>
                              </td>

                              <td className={`rounded-r-2xl border px-3 py-3 text-right font-semibold ${d.w.color}`}>
                                {formatEuro(d.total)}
                              </td>
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
                  const lunchDaysCount = r.details.reduce((sum, item) => sum + item.selectedLunchDays.length, 0);
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
                          {enrolledWeeks} sett., {lunchDaysCount} giorni mensa, {tripCount} gite, {poolCount} piscina
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