import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(loggedIn)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(loggedIn)/"!</div>
}
