import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  tableNumber: string;
  customerName: string;
  setTableNumber: (num: string) => void;
  setCustomerName: (name: string) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, variantLabel?: string) => void;
  updateQuantity: (id: string, variantLabel: string | undefined, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

const getKey = (id: string, variantLabel?: string) =>
  variantLabel ? `${id}__${variantLabel}` : id;

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  tableNumber: "",
  customerName: "",

  setTableNumber: (num) => set({ tableNumber: num }),
  setCustomerName: (name) => set({ customerName: name }),

  addItem: (item) =>
    set((state) => {
      const key = getKey(item.id, item.variantLabel);
      const existing = state.items.find(
        (i) => getKey(i.id, i.variantLabel) === key
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            getKey(i.id, i.variantLabel) === key
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id, variantLabel) =>
    set((state) => ({
      items: state.items.filter(
        (i) => getKey(i.id, i.variantLabel) !== getKey(id, variantLabel)
      ),
    })),

  updateQuantity: (id, variantLabel, qty) =>
    set((state) => {
      if (qty <= 0) {
        return {
          items: state.items.filter(
            (i) => getKey(i.id, i.variantLabel) !== getKey(id, variantLabel)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          getKey(i.id, i.variantLabel) === getKey(id, variantLabel)
            ? { ...i, quantity: qty }
            : i
        ),
      };
    }),

  clearCart: () => set({ items: [], tableNumber: "", customerName: "" }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
