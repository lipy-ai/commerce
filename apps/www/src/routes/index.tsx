import NavBar from "@/components/navBar";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
<<<<<<< HEAD
    <div>
      <NavBar/>
      <h3>Welcome Home!!!</h3>
    </div>
=======
    <>
      <NavBar />

      <div className="p-2">
        <h3>Welcome Home!!!</h3>
      </div>
    </>
>>>>>>> a4c94557186e2f4e06f43a496838ced5cc4878ad
  );
}
