import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import MemberPage from "@/pages/MemberPage";
import { withPages } from "@/members";

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center font-mono">
        <p className="text-red-700 text-2xl mb-2">[ 404 ]</p>
        <p className="text-muted-foreground text-sm">page not found</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {withPages.map((m) => (
        <Route
          key={m.key}
          path={`/${m.key}`}
          component={() => <MemberPage member={m} />}
        />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </>
  );
}

export default App;
