import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(shop)/$shopHandle/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/shop/$shopHandle/products/"!</div>
}
