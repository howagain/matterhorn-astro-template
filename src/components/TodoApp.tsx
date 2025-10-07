import { createSignal, For, Show } from "solid-js";
import {
  createQuery,
  createMutation,
  useQueryClient,
} from "@tanstack/solid-query";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string | Date;
};

export default function TodoApp() {
  const [newTitle, setNewTitle] = createSignal("");
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [editingTitle, setEditingTitle] = createSignal("");
  const queryClient = useQueryClient();

  const todosQuery = createQuery(() => ({
    queryKey: ["todos"],
    queryFn: async (): Promise<Todo[]> => {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return (await res.json()) as Todo[];
    },
  }));

  const addMutation = createMutation(() => ({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  }));

  const toggleMutation = createMutation(() => ({
    mutationFn: async (todo: Todo) => {
      const res = await fetch(
        `/api/todos/${encodeURIComponent(String(todo.id))}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ completed: !todo.completed }),
        }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  }));

  const saveTitleMutation = createMutation(() => ({
    mutationFn: async (payload: { id: number; title: string }) => {
      const res = await fetch(
        `/api/todos/${encodeURIComponent(String(payload.id))}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ title: payload.title }),
        }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  }));

  const deleteMutation = createMutation(() => ({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/todos/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  }));

  const addTodo = async (e: Event) => {
    e.preventDefault();
    const title = newTitle().trim();
    if (!title) return;
    await addMutation.mutateAsync(title);
    setNewTitle("");
  };

  const toggleTodo = async (todo: Todo) => {
    await toggleMutation.mutateAsync(todo);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveTitle = async (todo: Todo) => {
    const title = editingTitle().trim();
    if (!title || title === todo.title) {
      cancelEditing();
      return;
    }
    await saveTitleMutation.mutateAsync({ id: todo.id, title });
    cancelEditing();
  };

  const deleteTodo = async (todo: Todo) => {
    await deleteMutation.mutateAsync(todo.id);
  };

  return (
    <div
      style={{ "max-width": "720px", margin: "2rem auto", padding: "0 1rem" }}
    >
      <h1
        style={{
          "font-size": "1.75rem",
          "font-weight": 700,
          margin: "0 0 1rem",
        }}
      >
        Todos
      </h1>

      <form
        onSubmit={addTodo}
        style={{ display: "flex", gap: "0.5rem", "margin-bottom": "1rem" }}
      >
        <input
          type="text"
          placeholder="Add a new task…"
          value={newTitle()}
          onInput={(e) => setNewTitle(e.currentTarget.value)}
          required
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            border: "1px solid #ddd",
            "border-radius": "8px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 0.9rem",
            "border-radius": "8px",
            border: "1px solid #0ea5e9",
            background: "#0ea5e9",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      <Show when={!todosQuery.isLoading} fallback={<p>Loading…</p>}>
        <Show
          when={!todosQuery.error}
          fallback={
            <p style={{ color: "#dc2626" }}>{String(todosQuery.error)}</p>
          }
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <For each={todosQuery.data ?? []}>
              {(t) => (
                <li
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.5rem",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    margin: "0 0 0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTodo(t)}
                  />

                  <Show
                    when={editingId() === t.id}
                    fallback={<span style={{ flex: 1 }}>{t.title}</span>}
                  >
                    <input
                      type="text"
                      value={editingTitle()}
                      onInput={(e) => setEditingTitle(e.currentTarget.value)}
                      style={{
                        flex: 1,
                        padding: "0.35rem 0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    />
                  </Show>

                  <Show
                    when={editingId() === t.id}
                    fallback={
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => startEditing(t)}
                          style={{
                            padding: "0.35rem 0.6rem",
                            borderRadius: "6px",
                            border: "1px solid #d4d4d8",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(t)}
                          style={{
                            padding: "0.35rem 0.6rem",
                            borderRadius: "6px",
                            border: "1px solid #ef4444",
                            background: "#ef4444",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    }
                  >
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => saveTitle(t)}
                        style={{
                          padding: "0.35rem 0.6rem",
                          borderRadius: "6px",
                          border: "1px solid #16a34a",
                          background: "#16a34a",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        style={{
                          padding: "0.35rem 0.6rem",
                          borderRadius: "6px",
                          border: "1px solid #d4d4d8",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Show>
    </div>
  );
}
