"use client";
import { useQuery } from '@tanstack/react-query';
import { listOrders, Order } from '@/lib/api';

export function OrdersTable() {
  const { data, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: listOrders,
  });

  if (isLoading) return <p>Cargando…</p>;
  if (error) return <p className="text-red-600">Error al cargar órdenes</p>;
  if (!data?.length) return <p>No hay órdenes</p>;

  return (
    <table className="min-w-full bg-white rounded-2xl shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Ticker</th>
          <th className="p-2 text-right">Cantidad</th>
          <th className="p-2">ID</th>
          <th className="p-2">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o.id} className="border-t last:border-b">
            <td className="p-2 font-mono">{o.symbol}</td>
            <td className="p-2 text-right">{o.quantity}</td>
            <td className="p-2 text-xs">{o.id}</td>
            <td className="p-2 text-xs">
              {new Date(o.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
