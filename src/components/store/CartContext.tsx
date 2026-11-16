"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
  colour: string;
  img: string;
};

const STORAGE_KEY = "sukriti-cart";
const MAX_QTY = 5;

type Cart = {
  items: CartItem[];
  loaded: boolean;
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load once on the client; keep tabs in sync
  useEffect(() => {
    const read = () => {
      try {
        setItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      } catch {
        setItems([]);
      }
    };
    read();
    setLoaded(true);
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && read();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((update: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = update(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable (private mode) — cart still works for this visit
      }
      return next;
    });
  }, []);

  const same = (i: CartItem, id: string, size: string) => i.id === id && i.size === size;

  const add = useCallback(
    (item: Omit<CartItem, "qty">) =>
      save((prev) =>
        prev.some((i) => same(i, item.id, item.size))
          ? prev.map((i) => (same(i, item.id, item.size) ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i))
          : [...prev, { ...item, qty: 1 }]
      ),
    [save]
  );

  const remove = useCallback(
    (id: string, size: string) => save((prev) => prev.filter((i) => !same(i, id, size))),
    [save]
  );

  const setQty = useCallback(
    (id: string, size: string, qty: number) =>
      save((prev) =>
        qty < 1
          ? prev.filter((i) => !same(i, id, size))
          : prev.map((i) => (same(i, id, size) ? { ...i, qty: Math.min(qty, MAX_QTY) } : i))
      ),
    [save]
  );

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, loaded, count, total, add, setQty, remove }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
