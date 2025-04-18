import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(loggedIn)/merchants/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(loggedIn)/merchants/"!</div>
}
