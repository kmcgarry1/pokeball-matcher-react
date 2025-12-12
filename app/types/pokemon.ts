export type PokeballId =
  | "poke-ball"
  | "great-ball"
  | "ultra-ball"
  | "net-ball"
  | "dive-ball"
  | "fast-ball"
  | "luxury-ball"
  | "friend-ball"
  | "moon-ball"
  | "love-ball"
  | "heavy-ball"
  | "safari-ball"
  | "nest-ball"
  | "dusk-ball"
  | "lure-ball"
  | "repeat-ball"
  | "sport-ball"
  | "timer-ball"
  | "premier-ball"
  | "level-ball"
  | "quick-ball"
  | "cherish-ball"
  | "dream-ball"
  | "beast-ball"
  | "heal-ball"
  | "master-ball"
  | "strange-ball";

export type PokemonForm = {
  formName: string;
  balls?: PokeballId[];
  "shiny-balls"?: PokeballId[];
};

export type Pokemon = {
  id: number;
  name: string;
  balls?: PokeballId[];
  "shiny-balls"?: PokeballId[];
  forms?: PokemonForm[];
};

const POKEBALL_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";

export const POKEBALLS: Record<
  PokeballId,
  { id: PokeballId; name: string; spriteUrl: string }
> = {
  "poke-ball": {
    id: "poke-ball",
    name: "Poké Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}poke-ball.png`,
  },
  "great-ball": {
    id: "great-ball",
    name: "Great Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}great-ball.png`,
  },
  "ultra-ball": {
    id: "ultra-ball",
    name: "Ultra Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}ultra-ball.png`,
  },
  "net-ball": {
    id: "net-ball",
    name: "Net Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}net-ball.png`,
  },
  "dive-ball": {
    id: "dive-ball",
    name: "Dive Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}dive-ball.png`,
  },
  "fast-ball": {
    id: "fast-ball",
    name: "Fast Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}fast-ball.png`,
  },
  "luxury-ball": {
    id: "luxury-ball",
    name: "Luxury Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}luxury-ball.png`,
  },
  "friend-ball": {
    id: "friend-ball",
    name: "Friend Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}friend-ball.png`,
  },
  "moon-ball": {
    id: "moon-ball",
    name: "Moon Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}moon-ball.png`,
  },
  "love-ball": {
    id: "love-ball",
    name: "Love Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}love-ball.png`,
  },
  "heavy-ball": {
    id: "heavy-ball",
    name: "Heavy Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}heavy-ball.png`,
  },
  "safari-ball": {
    id: "safari-ball",
    name: "Safari Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}safari-ball.png`,
  },
  "nest-ball": {
    id: "nest-ball",
    name: "Nest Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}nest-ball.png`,
  },
  "dusk-ball": {
    id: "dusk-ball",
    name: "Dusk Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}dusk-ball.png`,
  },
  "lure-ball": {
    id: "lure-ball",
    name: "Lure Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}lure-ball.png`,
  },
  "repeat-ball": {
    id: "repeat-ball",
    name: "Repeat Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}repeat-ball.png`,
  },
  "sport-ball": {
    id: "sport-ball",
    name: "Sport Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}sport-ball.png`,
  },
  "timer-ball": {
    id: "timer-ball",
    name: "Timer Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}timer-ball.png`,
  },
  "premier-ball": {
    id: "premier-ball",
    name: "Premier Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}premier-ball.png`,
  },
  "level-ball": {
    id: "level-ball",
    name: "Level Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}level-ball.png`,
  },
  "quick-ball": {
    id: "quick-ball",
    name: "Quick Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}quick-ball.png`,
  },
  "cherish-ball": {
    id: "cherish-ball",
    name: "Cherish Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}cherish-ball.png`,
  },
  "dream-ball": {
    id: "dream-ball",
    name: "Dream Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}dream-ball.png`,
  },
  "beast-ball": {
    id: "beast-ball",
    name: "Beast Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}beast-ball.png`,
  },
  "heal-ball": {
    id: "heal-ball",
    name: "Heal Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}heal-ball.png`,
  },
  "master-ball": {
    id: "master-ball",
    name: "Master Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}master-ball.png`,
  },
  "strange-ball": {
    id: "strange-ball",
    name: "Strange Ball",
    spriteUrl: `${POKEBALL_SPRITE_BASE_URL}strange-ball.png`,
  },
};
