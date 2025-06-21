import { CreateOrder } from '@/components/CreateOrder';
import { OrdersTable } from '@/components/OrdersTable';

export default function Home() {
  return (
    <main className="container mx-auto p-8 flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Quant Platform Web</h1>
      <CreateOrder />
      <OrdersTable />
    </main>
  );
}
