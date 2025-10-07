import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import TodoApp from "./TodoApp";

export default function TodosRoot() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}
