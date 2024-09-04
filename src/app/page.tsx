import { TetrisGame } from "@/components/tetris-game";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24 bg-slate-900 ">
      <TetrisGame />
    </main>
  );
}
