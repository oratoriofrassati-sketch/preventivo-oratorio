"use client";

import { useState, useMemo } from "react";

const GENERAL_FEE = 30;
const EXTRA_SHIRT = 10;

const weeks = [
  { id: 1, label: "1 (9-12 giugno)", base: 15, mensa: 12, piscina: 18, gita: 20, gitaNome: "Pian Sciresa" },
  { id: 2, label: "2 (15-19 giugno)", base: 15, mensa: 18, piscina: 18, gita: 25, gitaNome: "Cornelle" },
  { id: 3, label: "3 (22-26 giugno)", base: 15, mensa: 18, piscina: 18, gita: 28, gitaNome: "Acquatica" },
  { id: 4, label: "4 (29 giu-3 lug)", base: 15, mensa: 18, piscina: 18, gita: 28, gitaNome: "Lago Moro" },
  { id: 5, label: "5 (6-10 luglio)", base: 15, mensa: 18, piscina: 18, gita: 20, gitaNome: "Abbadia" },
  { id: 6, label: "6 (13-16 luglio)", base: 15, mensa: 12, piscina: 18, gita: 30, gitaNome: "Parco sospeso" },
  { id: 7, label: "7 (2-4 settembre)", base: 10, mensa: 12, piscina: 0, gita: 25, gitaNome: "Acquaworld" },
  { id: 8, label: "8 (7-11 settembre)", base: 15, mensa: 24, piscina: 0, gita: 28, gitaNome: "Volandia" },
];

function euro(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

type WeekSel = {
  id: number;
  iscrizione: boolean;
  mensa: boolean;
  piscina: boolean;
  gita: boolean;
};

type Person = {
  id: number;
  nome: string;
  ruolo: "figlio" | "animatore";
  maglietta: boolean;
  weeks: WeekSel[];
};

function createWeeks(): WeekSel[] {
  return weeks.map((w) => ({
    id: w.id,
    iscrizione: false,
    mensa: false,
    piscina: false,
    gita: false,
  }));
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [people, setPeople] = useState<Person[]>([
    { id: 1, nome: "", ruolo: "figlio", maglietta: false, weeks: createWeeks() },
  ]);

  function addPerson(tipo: "figlio" | "animatore") {
    setPeople([
      ...people,
      {
        id: Date.now(),
        nome: "",
        ruolo: tipo,
        maglietta: false,
        weeks: createWeeks(),
      },
    ]);
  }

  function updatePerson(id: number, data: Partial<Person>) {
    setPeople(people.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }

  function toggleWeek(pid: number, wid: number, key: keyof WeekSel) {
    setPeople(
      people.map((p) => {
        if (p.id !== pid) return p;

        return {
          ...p,
          weeks: p.weeks.map((w) => {
            if (w.id !== wid) return w;

            const updated = { ...w, [key]: !w[key] };

            if (!updated.iscrizione) {
              updated.mensa = false;
              updated.piscina = false;
              updated.gita = false;
            }

            return updated;
          }),
        };
      })
    );
  }

  const totals = useMemo(() => {
    return people.map((p, index) => {
      const posizioneFiglio =
        p.ruolo === "figlio"
          ? people.filter((x, i) => x.ruolo === "figlio" && i <= index).length
          : 0;

      let tot = GENERAL_FEE;

      if (p.maglietta) tot += EXTRA_SHIRT;

      p.weeks.forEach((w) => {
        if (!w.iscrizione) return;

        const ref = weeks.find((x) => x.id === w.id)!;

        let base = ref.base;

        if (p.ruolo === "figlio") {
          if (posizioneFiglio === 2 && w.id !== 7) base = 10;
          if (posizioneFiglio >= 3 && w.id !== 7) base = 5;
        } else {
          base = 0;
        }

        tot += base;

        if (w.mensa) tot += ref.mensa;
        if (w.piscina) tot += ref.piscina;
        if (w.gita) tot += ref.gita;
      });

      return tot;
    });
  }, [people]);

  const totalAll = totals.reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-6">
        <img src="/logo.png" className="h-16 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Preventivo Oratorio Estivo</h1>
      </div>

      <div className="mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Email genitore"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => addPerson("figlio")} className="bg-black text-white px-3 py-2 rounded">
          + Figlio
        </button>
        <button onClick={() => addPerson("animatore")} className="border px-3 py-2 rounded">
          + Animatore
        </button>
      </div>

      {people.map((p, i) => (
        <div key={p.id} className="border rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <strong>{p.nome || `Partecipante ${i + 1}`}</strong>
            <span>{euro(totals[i])}</span>
          </div>

          <input
            placeholder="Nome"
            className="border p-2 w-full mb-3 rounded"
            value={p.nome}
            onChange={(e) => updatePerson(p.id, { nome: e.target.value })}
          />

          <label className="flex justify-between mb-3">
            <span>Maglietta aggiuntiva</span>
            <input
              type="checkbox"
              checked={p.maglietta}
              onChange={() => updatePerson(p.id, { maglietta: !p.maglietta })}
            />
          </label>

          <div className="space-y-3">
            {p.weeks.map((w) => {
              const ref = weeks.find((x) => x.id === w.id)!;

              return (
                <div key={w.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <strong>{ref.label}</strong>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span>Iscrizione</span>
                    <input type="checkbox" checked={w.iscrizione} onChange={() => toggleWeek(p.id, w.id, "iscrizione")} />
                  </div>

                  <div className="flex justify-between">
                    <span>Mensa</span>
                    <input type="checkbox" disabled={!w.iscrizione} checked={w.mensa} onChange={() => toggleWeek(p.id, w.id, "mensa")} />
                  </div>

                  <div className="flex justify-between">
                    <span>Piscina</span>
                    <input type="checkbox" disabled={!w.iscrizione} checked={w.piscina} onChange={() => toggleWeek(p.id, w.id, "piscina")} />
                  </div>

                  <div className="flex justify-between">
                    <span>{ref.gitaNome}</span>
                    <input type="checkbox" disabled={!w.iscrizione} checked={w.gita} onChange={() => toggleWeek(p.id, w.id, "gita")} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-right text-xl font-bold">
        Totale: {euro(totalAll)}
      </div>
    </div>
  );
}