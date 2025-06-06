import { Orbit } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <Orbit size={72} />
      <h1 className="text-4xl leading-tight font-bold tracking-tight">
        Coming Soon 👀
      </h1>
      <p className="text-muted-foreground text-center">
        This page has not been created yet. <br />
        Stay tuned though!
      </p>
    </div>
  );
}
