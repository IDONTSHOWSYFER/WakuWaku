export type Toast = { id: string; titre: string; message?: string };

type Listener = (toasts: Toast[]) => void;
let toasts: Toast[] = [];
const listeners = new Set<Listener>();

export function pushToast(t: Omit<Toast, "id">) {
  const id = crypto.randomUUID();
  toasts = [{ id, ...t }, ...toasts].slice(0, 4);
  emit();
  setTimeout(() => {
    toasts = toasts.filter(x => x.id !== id);
    emit();
  }, 2600);
}

export function subscribe(cb: (items: Toast[]) => void) {
  listeners.add(cb);
  cb(toasts); // push initial
  return () => {
    listeners.delete(cb); // ✅ retourne void, pas boolean
  };
}

function emit() {
  for (const l of listeners) l(toasts);
}