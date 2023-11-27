import { useEffect, useState } from "react";
import "./Counter.css";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CounterState {
  count: number;
  setCount: (newCount: number) => void;
}

const useCounterState = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      setCount: (newCount: number) => set({ count: newCount }),
    }),
    {
      name: "home-count", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default function CounterMain({ children }: { children: JSX.Element }) {
  const [initCount, setInitCount] = useState<number>(0);
  const { count, setCount } = useCounterState();
  useEffect(() => {
    setInitCount(count);
  });

  const add = () => setCount(count + 1);
  const subtract = () => {
    alert("我就不让你一直点减");
    setCount(count - 1);
  };

  return (
    <>
      <div className="counter">
        <button onClick={subtract}>-</button>
        <pre>{initCount}</pre>
        <button onClick={add}>+</button>
      </div>
      <div className="counter-message">{children}</div>
    </>
  );
}
