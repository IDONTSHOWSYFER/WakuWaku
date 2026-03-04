"use client";

import { useEffect, useState } from "react";
import { subscribe, type Toast } from "./toastStore";

export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>([]);

useEffect(() => {
  const unsubscribe = subscribe(setItems);
  return () => unsubscribe();
}, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(380px,calc(100vw-2rem))] space-y-2">
      {items.map((t) => (
        <div key={t.id} className="glass card rounded-2xl px-4 py-3">
          <div className="font-extrabold text-zinc-900">{t.titre}</div>
          {t.message ? <div className="text-sm text-zinc-600 mt-1">{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}