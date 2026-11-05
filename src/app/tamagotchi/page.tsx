import { Suspense } from "react";
import TamagotchiScreen from "@/components/tamagotchi-screen";

export default function TamagotchiPage() {
  return (
    <Suspense fallback={null}>
      <TamagotchiScreen />
    </Suspense>
  );
}
