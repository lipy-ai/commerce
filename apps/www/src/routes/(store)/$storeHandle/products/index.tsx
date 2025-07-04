import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(store)/$storeHandle/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/shop/$shopHandle/products/"!</div>
}
