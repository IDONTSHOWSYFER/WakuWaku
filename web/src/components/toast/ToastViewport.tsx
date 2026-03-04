"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribe, Toast } from "./toastStore";

export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => subscribe(setItems), []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(380px,calc(100vw-2rem))] space-y-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="glass card"
          >
            <div className="font-extrabold">{t.titre}</div>
            {t.message ? <div className="text-sm text-zinc-700 mt-1">{t.message}</div> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}