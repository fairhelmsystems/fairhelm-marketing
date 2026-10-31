"use client";

import { useCallback, useEffect, useRef } from "react";
import { judgeSubmission, type SubmissionVerdict } from "../lib/form-guard";

/** Starts a clock when the form mounts; `judge` reads it at submit time. */
export function useFormGuard(): (honeypot: string) => SubmissionVerdict {
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  return useCallback(
    (honeypot) => judgeSubmission({ honeypot, openedAt: openedAt.current, now: performance.now() }),
    []
  );
}
