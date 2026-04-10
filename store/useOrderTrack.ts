import { create } from "zustand";

interface OrderTrackState {
  sessionId: string | null;
  customerName: string | null;
  tableNumber: string | null;
  setSession: (sessionId: string, name: string, table: string) => void;
  clearSession: () => void;
}

const STORAGE_KEY = "casa-session";

const getStored = (): Partial<OrderTrackState> => {
  if (typeof window === "undefined") return {};
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (state: Partial<OrderTrackState>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId: state.sessionId,
        customerName: state.customerName,
        tableNumber: state.tableNumber,
      }),
    );
  } catch {}
};

const stored = getStored();

export const useOrderTrack = create<OrderTrackState>((set) => ({
  sessionId: stored.sessionId || null,
  customerName: stored.customerName || null,
  tableNumber: stored.tableNumber || null,

  setSession: (sessionId, name, table) => {
    const state = { sessionId, customerName: name, tableNumber: table };
    saveToStorage(state);
    set(state);
  },

  clearSession: () => {
    const state = { sessionId: null, customerName: null, tableNumber: null };
    saveToStorage(state);
    set(state);
  },
}));
