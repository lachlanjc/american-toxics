"use client";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";

export default function NewScorePage() {
  return (
    <main className="p-2">
      <HeaderRoot closeLink="/scoreboard/results" showClose>
        <HeaderTitle>Where did you grow up?</HeaderTitle>
      </HeaderRoot>
      <form action="/scoreboard" method="POST">
        <search className="action-button mb-4 w-full">
          <input
            autoFocus
            className="w-full p-2 outline-none"
            name="address"
            placeholder="Enter an address"
            type="search"
          />
        </search>
      </form>
    </main>
  );
}
