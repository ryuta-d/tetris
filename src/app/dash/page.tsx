import XRevenueDashboard from "@/components/dash";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
      <main className="flex h-screen flex-col items-center justify-between p-24 bg-slate-900 ">
        <Button>
        <Link href="/">テトリスはこちら</Link>
      </Button>
        <XRevenueDashboard />
      </main>
    );
  }