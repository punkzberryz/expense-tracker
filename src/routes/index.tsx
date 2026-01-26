import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div>
      <h1>Hello</h1>
      <p>This is an expense tracker page</p>
      <Button asChild variant="link">
        <Link to="/expense">Go to Expense</Link>
      </Button>
    </div>
  );
}
