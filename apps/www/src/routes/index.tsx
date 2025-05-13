import NavBar from "@/components/navBar";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <NavBar/>
      <h3>Welcome Home!!!</h3>
    </div>
  );
}
