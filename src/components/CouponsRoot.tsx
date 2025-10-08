import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { type JSX } from "solid-js";

export default function CouponsRoot(props: { children: JSX.Element }) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}

