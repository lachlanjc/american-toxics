"use client";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";

export default function NewScorePage() {
  return (
    <main className="p-2">
      <HeaderRoot showClose closeLink="/scoreboard/results">
        <HeaderTitle>Where did you grow up?</HeaderTitle>
      </HeaderRoot>
      <form action="/scoreboard" method="POST">
        <search className="w-full action-button mb-4">
          <input
            type="search"
            name="address"
            placeholder="Enter an address"
            className="p-2 w-full outline-none"
            autoFocus
          />
        </search>
      </form>
    </main>
  );
}
