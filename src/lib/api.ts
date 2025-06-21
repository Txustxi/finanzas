"use client";
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export interface Order {
  id: string;
  symbol: string;
  quantity: number;
  timestamp: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const correlationId = () => crypto.randomUUID().replace(/-/g, '');

export async function createOrder(symbol: string, quantity: number): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-Id': correlationId(),
    },
    body: JSON.stringify({ symbol, quantity }),
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return (await res.json()) as Order;
}

export async function listOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json() as Promise<Order[]>;
}

export async function listHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json() as Promise<{ status: string; ts: string }>;
}
