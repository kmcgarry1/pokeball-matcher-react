import { POKEBALLS } from "../types/pokemon";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const ALL_POKEMON_ENDPOINT = `${API_BASE_URL}/pokemon?limit=10000`;

type RawListResult = {
  name: string;
  url: string;
  forms: string[];
};

type RawListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawListResult[];
};

export type PokemonListItem = {
  id: number;
  name: string;
  forms: string[];
  url: string;
};

let cachedAll: { data: PokemonListItem[] | null; fetchedAt: number | null } = { data: null, fetchedAt: null };
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  const now = Date.now();
  if (
    cachedAll &&
    cachedAll.data &&
    cachedAll.fetchedAt &&
    now - cachedAll.fetchedAt < CACHE_TTL_MS
  ) {
    return cachedAll.data;
  }

  const response = await fetch(ALL_POKEMON_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch all Pokémon: ${response.statusText}`);
  }

  const rawData: RawListResponse = await response.json();
  const formattedData: PokemonListItem[] = rawData.results.map((item) => {
    const idMatch = item.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? parseInt(idMatch[1], 10) : NaN;
    return {
      id,
      name: item.name,
      forms: item.forms,
      url: item.url,
    };
  });

  cachedAll = { data: formattedData, fetchedAt: now };
  return formattedData;
}

let cachedBalls: { data: typeof POKEBALLS | null; fetchedAt: number | null } = { data: null, fetchedAt: null };

export async function getAllPokeballs(): Promise<typeof POKEBALLS> {
  const now = Date.now();
  if (
    cachedBalls &&
    cachedBalls.data &&
    cachedBalls.fetchedAt &&
    now - cachedBalls.fetchedAt < CACHE_TTL_MS
  ) {
    return cachedBalls.data;
  }

  cachedBalls = { data: POKEBALLS, fetchedAt: now };
  return POKEBALLS;
}

export function clearPokeballCache() {
  cachedBalls = { data: null, fetchedAt: null };
}

export function clearCache() {
  cachedAll = { data: null, fetchedAt: null };
  clearPokeballCache();
}
