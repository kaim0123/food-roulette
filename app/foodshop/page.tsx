import { RouletteApp } from "@/components/roulette";
import { shopRouletteConfig } from "@/lib/roulette/presets";

export default function FoodshopPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-50 text-zinc-900">
      <RouletteApp config={shopRouletteConfig} />
    </div>
  );
}
