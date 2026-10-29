"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Features are loaded asynchronously to keep the initial bundle small.
const loadFeatures = () => import("framer-motion").then((m) => m.domAnimation);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}