import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="fade-in" exit="fade-out" default="none">
      <div className="route-transition-shell">{children}</div>
    </ViewTransition>
  );
}
