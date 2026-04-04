import { RouletteApp } from "@/components/roulette";
import { recipeRouletteConfig } from "@/lib/roulette/presets";

export default function RecipePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-50 text-zinc-900">
      <RouletteApp config={recipeRouletteConfig} />
    </div>
  );
}
