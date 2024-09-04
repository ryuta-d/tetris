import { TetrisGame } from "@/components/tetris-game";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24 bg-slate-900 ">
      <Button>
        <Link href="/dash">ダッシュボードはこちら</Link>
      </Button>
      <TetrisGame />
    </main>
  );
}
