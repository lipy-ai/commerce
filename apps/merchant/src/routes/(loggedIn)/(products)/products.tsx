import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(loggedIn)/(products)/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(loggedIn)/(products)/products"!</div>
}
