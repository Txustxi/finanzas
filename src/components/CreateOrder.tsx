"use client";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export function CreateOrder() {
  const qc = useQueryClient();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState<number>(0);

  const mut = useMutation({
    mutationFn: () => createOrder(symbol, quantity),
    onSuccess: () => {
      setSymbol('');
      setQuantity(0);
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
      className="flex flex-col gap-4 bg-white rounded-2xl p-6 shadow-lg max-w-md"
    >
      <h2 className="text-xl font-semibold">Nueva orden</h2>
      <input
        required
        type="text"
        placeholder="Ticker (AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        className="border rounded-xl p-2"
      />
      <input
        required
        type="number"
        placeholder="Cantidad"
        min={1}
        value={quantity || ''}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        className="border rounded-xl p-2"
      />
      <Button disabled={mut.isPending} type="submit">
        {mut.isPending ? 'Enviando…' : 'Enviar'}
      </Button>
      {mut.isError && <p className="text-red-600">{String(mut.error)}</p>}
      {mut.isSuccess && <p className="text-green-600">✅ Orden enviada</p>}
    </form>
  );
}
