import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => c.text("List Books")); // GET /book
route.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text("Get Book: " + id);
});
route.post("/", (c) => c.text("Create Book")); // POST /book

export { route as userRouter };
