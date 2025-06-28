import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(loggedIn)/order/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(loggedIn)/order/create"!</div>
}
