import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pos/order/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(loggedIn)/order/create"!</div>
}
