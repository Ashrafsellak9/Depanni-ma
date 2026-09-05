"use client";

import dynamic from "next/dynamic";

const RequestModal = dynamic(
  () =>
    import("@/components/landing/request/RequestModal").then((m) => ({ default: m.RequestModal })),
  { ssr: false },
);

export function RequestModalHost() {
  return <RequestModal />;
}
