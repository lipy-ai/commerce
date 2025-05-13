import NavBar from "@/components/navBar";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@repo-lib/providers/auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const data = authClient.useSession();

  return (

    <>
      <NavBar />

      <div className="p-2">
        <h3>Welcome Home!!!</h3>

        <pre className="whitespace-pre-wrap max-w-md p-8">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </>
  );
}
