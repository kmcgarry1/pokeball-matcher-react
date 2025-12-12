"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import pokedexJson from "./pokemon-databases/kanto-pokedex.json";
import { POKEBALLS, PokeballId, Pokemon } from "./types/pokemon";

type PokedexData = { pokemon: Pokemon[] };
type BallDetails = { id: PokeballId; name: string; spriteUrl: string };

const pokedex = (pokedexJson as PokedexData).pokemon ?? [];
const FORM_SPRITE_SUFFIX: Record<string, string> = {
  Alolan: "alola",
  Galarian: "galar",
  Hisuian: "hisui",
  "Combat Breed": "paldea-combat-breed",
};
const formSpriteCache = new Map<string, { normal: string; shiny?: string }>();

function mapBallIds(ballIds?: PokeballId[]): BallDetails[] {
  if (!ballIds) return [];
  return ballIds
    .map((id) => POKEBALLS[id])
    .filter((ball): ball is BallDetails => Boolean(ball));
}

function getFormNameKey(pokemon: Pokemon) {
  return `${pokemon.id}`;
}

function slugifyPokemonName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function BallStack({ balls }: { balls: BallDetails[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl bg-white/80 p-2 shadow-inner shadow-slate-100 ring-1 ring-slate-100">
      {balls.length ? (
        balls.map((ball, index) => (
          <div
            key={`${ball.id}-${index}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200"
          >
            <Image
              src={ball.spriteUrl}
              alt={ball.name}
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
        ))
      ) : (
        <span className="text-[11px] text-slate-400">—</span>
      )}
    </div>
  );
}

function SpritePanel({
  title,
  spriteUrl,
  gradient,
}: {
  title: string;
  spriteUrl: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative flex h-full flex-col justify-center overflow-hidden rounded-2xl p-4 ring-1 ring-slate-100 ${gradient}`}
    >
      <div className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm ring-1 ring-slate-200">
        {title}
      </div>
      <div className="relative flex h-full items-center justify-center">
        <Image
          src={spriteUrl}
          alt={`${title} sprite`}
          width={256}
          height={256}
          className="h-full w-full max-w-[12rem] object-contain drop-shadow"
        />
      </div>
    </div>
  );
}

function PokemonCard({
  pokemon,
  selectedForm,
  onSelectForm,
}: {
  pokemon: Pokemon;
  selectedForm?: string;
  onSelectForm: (formName: string | undefined) => void;
}) {
  const activeForm = selectedForm
    ? pokemon.forms?.find((form) => form.formName === selectedForm)
    : undefined;
  const standardBalls = mapBallIds(activeForm?.balls ?? pokemon.balls);
  const shinyBalls = mapBallIds(
    activeForm?.["shiny-balls"] ?? pokemon["shiny-balls"]
  );

  const baseSpriteUrl = useMemo(() => {
    const baseId = pokemon.id.toString();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${baseId}.png`;
  }, [pokemon.id]);
  const baseShinyUrl = useMemo(() => {
    const baseId = pokemon.id.toString();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${baseId}.png`;
  }, [pokemon.id]);
  const [spriteUrls, setSpriteUrls] = useState<{
    normal: string;
    shiny?: string;
  }>({ normal: baseSpriteUrl, shiny: baseShinyUrl });

  const handleFormSelect = (value: string | undefined) => {
    if (!value) {
      setSpriteUrls({ normal: baseSpriteUrl, shiny: baseShinyUrl });
      onSelectForm(undefined);
      return;
    }

    if (!FORM_SPRITE_SUFFIX[value]) {
      setSpriteUrls({ normal: baseSpriteUrl, shiny: baseShinyUrl });
      onSelectForm(value);
      return;
    }

    const cacheKey = `${pokemon.id}-${value}`;
    if (formSpriteCache.has(cacheKey)) {
      setSpriteUrls(formSpriteCache.get(cacheKey)!);
    }

    onSelectForm(value);
  };

  useEffect(() => {
    if (!selectedForm) return;

    const suffix = FORM_SPRITE_SUFFIX[selectedForm];
    if (!suffix) return;

    const cacheKey = `${pokemon.id}-${selectedForm}`;
    if (formSpriteCache.has(cacheKey)) return;

    const slug = `${slugifyPokemonName(pokemon.name)}-${suffix}`;
    let cancelled = false;

    fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load form sprite");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normal =
          data?.sprites?.other?.["official-artwork"]?.front_default ??
          data?.sprites?.front_default ??
          baseSpriteUrl;
        const shiny =
          data?.sprites?.other?.["official-artwork"]?.front_shiny ??
          data?.sprites?.front_shiny ??
          baseShinyUrl;
        const payload = { normal, shiny };
        formSpriteCache.set(cacheKey, payload);
        setSpriteUrls(payload);
      })
      .catch(() => {
        if (!cancelled) {
          setSpriteUrls({ normal: baseSpriteUrl, shiny: baseShinyUrl });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseShinyUrl, baseSpriteUrl, pokemon.id, pokemon.name, selectedForm]);

  return (
    <div
      className="grid min-h-[360px] grid-cols-4 gap-2 rounded-2xl bg-white/95 p-3 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200 backdrop-blur-sm"
      style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
    >
      <div className="col-span-1 row-span-1 flex items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold uppercase tracking-wide text-white">
        #{pokemon.id.toString().padStart(3, "0")}
      </div>
      <div className="col-span-3 col-start-2 row-span-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
        <p className="flex-1 truncate text-base font-bold text-slate-900">
          {pokemon.name}
        </p>
        {pokemon.forms?.length ? (
          <select
            value={selectedForm ?? ""}
            onChange={(event) =>
              handleFormSelect(
                event.target.value === "" ? undefined : event.target.value
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-200"
          >
            <option value="">Standard</option>
            {pokemon.forms.map((form) => (
              <option key={form.formName} value={form.formName}>
                {form.formName}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="col-span-1 col-start-1 row-span-3 row-start-2">
        <BallStack balls={standardBalls} />
      </div>
      <div className="col-span-3 col-start-2 row-span-3 row-start-2">
        <SpritePanel
          title="Standard"
          spriteUrl={spriteUrls.normal}
          gradient="bg-gradient-to-br from-slate-50 via-white to-sky-50"
        />
      </div>

      <div className="col-span-1 col-start-1 row-span-3 row-start-5">
        <BallStack balls={shinyBalls} />
      </div>
      <div className="col-span-3 col-start-2 row-span-3 row-start-5">
        <SpritePanel
          title="Shiny"
          spriteUrl={spriteUrls.shiny ?? spriteUrls.normal}
          gradient="bg-gradient-to-br from-amber-50 via-white to-orange-50"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [formSelections, setFormSelections] = useState<
    Record<string, string | undefined>
  >({});

  const filteredPokedex = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pokedex;
    return pokedex.filter((pokemon) => {
      const idMatch = pokemon.id.toString().includes(term);
      const nameMatch = pokemon.name.toLowerCase().includes(term);
      return idMatch || nameMatch;
    });
  }, [search]);

  if (!pokedex.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-lg">No Pokémon data found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800/40 bg-slate-800/40 px-4 py-3 shadow-lg shadow-slate-900/30 backdrop-blur">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              Gen 1 Pokédex
            </p>
            <h1 className="text-xl font-bold text-white">Poké Ball matcher</h1>
            <p className="text-sm text-slate-200">
              Standard & shiny sprites with vertical Poké Ball columns.
            </p>
          </div>
          <div className="flex w-full flex-1 min-w-[220px] max-w-xs items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-slate-600 focus-within:ring-2 focus-within:ring-sky-400">
            <span className="text-base opacity-70">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or number"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-300 focus:outline-none"
            />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPokedex.map((pokemon) => {
            const key = getFormNameKey(pokemon);
            const selectedForm = formSelections[key];
            return (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                selectedForm={selectedForm}
                onSelectForm={(formName) =>
                  setFormSelections((prev) => ({
                    ...prev,
                    [key]: formName,
                  }))
                }
              />
            );
          })}
          {!filteredPokedex.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-6 text-center text-slate-200">
              No Pokémon match “{search}”.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
