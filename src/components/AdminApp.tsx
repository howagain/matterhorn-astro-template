import { type JSX, createSignal, For, onMount } from "solid-js";
import {
  createMutation,
  createQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/solid-query";
import Coupon, { type CouponData } from "@components/Coupon";

function defaultCoupon(dealerId: string): CouponData {
  return {
    dealerId,
    title: "New Coupon",
    description: "Describe your offer",
    discountAmount: "$100 OFF",
    expirationDate: "2025-12-31",
    buttonText: "Redeem",
    buttonColor: "#0ea5e9",
    backgroundImage: "",
    layout: "horizontal",
    customFields: {},
  };
}

type Props = { dealerId: string };

function AdminBody(props: Props): JSX.Element {
  const queryClient = useQueryClient();
  const couponsQuery = createQuery(() => ({
    queryKey: ["coupons", props.dealerId],
    queryFn: async (): Promise<CouponData[]> => {
      const res = await fetch(
        `/api/coupons/${encodeURIComponent(props.dealerId)}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const items = (await res.json()) as any[];
      return items as CouponData[];
    },
  }));

  const [current, setCurrent] = createSignal<CouponData>(
    defaultCoupon(props.dealerId)
  );
  const [layoutJsonText, setLayoutJsonText] = createSignal<string>(
    JSON.stringify({ blocks: [] }, null, 2)
  );

  onMount(() => {
    const first = couponsQuery.data?.[0];
    if (first) setCurrent(first);
  });

  const saveMutation = createMutation(() => ({
    mutationFn: async (payload: CouponData) => {
      const res = await fetch(
        `/api/coupons/${encodeURIComponent(props.dealerId)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            id: payload.id,
            title: payload.title,
            description: payload.description,
            discount_amount: payload.discountAmount,
            expiration_date: payload.expirationDate,
            button_text: payload.buttonText,
            button_color: payload.buttonColor,
            background_image: payload.backgroundImage,
            layout: payload.layout,
            custom_fields: payload.customFields,
          }),
        }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      if (res.status === 201) {
        const { id } = await res.json();
        setCurrent({ ...payload, id });
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons", props.dealerId] }),
  }));

  const pageQuery = createQuery(() => ({
    queryKey: ["page", props.dealerId],
    queryFn: async () => {
      const res = await fetch(
        `/api/pages/${encodeURIComponent(props.dealerId)}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data?.layoutJson)
        setLayoutJsonText(JSON.stringify(data.layoutJson, null, 2));
      return data;
    },
  }));

  const savePageMutation = createMutation(() => ({
    mutationFn: async () => {
      let parsed: any = {};
      try {
        parsed = JSON.parse(layoutJsonText());
      } catch {
        throw new Error("Invalid JSON");
      }
      const existing = await pageQuery.refetch();
      const id = existing.data?.id;
      const res = await fetch(
        `/api/pages/${encodeURIComponent(props.dealerId)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, layout_json: parsed }),
        }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    },
    onSuccess: () => pageQuery.refetch(),
  }));

  const addCustomField = () => {
    const next = {
      ...current(),
      customFields: { ...(current().customFields || {}) },
    } as CouponData;
    let i = 1;
    let key = `key${i}`;
    while (next.customFields![key] !== undefined) {
      i += 1;
      key = `key${i}`;
    }
    next.customFields![key] = "";
    setCurrent(next);
  };

  const removeCustomField = (k: string) => {
    const next = {
      ...current(),
      customFields: { ...(current().customFields || {}) },
    } as CouponData;
    delete next.customFields![k];
    setCurrent(next);
  };

  const exampleLayoutJson =
    '{"blocks":[{"type":"coupon","props":{"coupon_id":"abc"}}]}';

  return (
    <div class="page">
      <div class="card">
        <h2 style={{ "margin-bottom": "0.75rem" }}>Coupon Builder</h2>
        <div class="row">
          <label>Title</label>
          <input
            type="text"
            value={current().title}
            onInput={(e) =>
              setCurrent({ ...current(), title: e.currentTarget.value })
            }
          />
        </div>
        <div class="row">
          <label>Description</label>
          <textarea
            value={current().description}
            onInput={(e) =>
              setCurrent({ ...current(), description: e.currentTarget.value })
            }
          />
        </div>
        <div class="row">
          <label>Discount Amount</label>
          <input
            type="text"
            value={current().discountAmount}
            onInput={(e) =>
              setCurrent({
                ...current(),
                discountAmount: e.currentTarget.value,
              })
            }
          />
        </div>
        <div class="row">
          <label>Expiration Date</label>
          <input
            type="text"
            value={current().expirationDate}
            onInput={(e) =>
              setCurrent({
                ...current(),
                expirationDate: e.currentTarget.value,
              })
            }
          />
        </div>
        <div class="row">
          <label>Button Text</label>
          <input
            type="text"
            value={current().buttonText}
            onInput={(e) =>
              setCurrent({ ...current(), buttonText: e.currentTarget.value })
            }
          />
        </div>
        <div class="row">
          <label>Button Color</label>
          <input
            type="text"
            value={current().buttonColor}
            onInput={(e) =>
              setCurrent({ ...current(), buttonColor: e.currentTarget.value })
            }
          />
        </div>
        <div class="row">
          <label>Background Image URL</label>
          <input
            type="text"
            value={current().backgroundImage}
            onInput={(e) =>
              setCurrent({
                ...current(),
                backgroundImage: e.currentTarget.value,
              })
            }
          />
        </div>
        <div class="row">
          <label>Layout</label>
          <select
            value={current().layout}
            onChange={(e) =>
              setCurrent({ ...current(), layout: e.currentTarget.value as any })
            }
          >
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
            <option value="modal">modal</option>
          </select>
        </div>

        <div style={{ margin: "1rem 0 .5rem", "font-weight": 600 }}>
          Custom Fields
        </div>
        <div class="kv">
          <For each={Object.entries(current().customFields || {})}>
            {([k, v]) => (
              <div class="kv-row">
                <input
                  type="text"
                  value={k}
                  onChange={(e) => {
                    const next = {
                      ...current(),
                      customFields: { ...(current().customFields || {}) },
                    } as CouponData;
                    const val = next.customFields![k];
                    delete next.customFields![k];
                    next.customFields![e.currentTarget.value] = val;
                    setCurrent(next);
                  }}
                />
                <input
                  type="text"
                  value={v}
                  onInput={(e) =>
                    setCurrent({
                      ...current(),
                      customFields: {
                        ...(current().customFields || {}),
                        [k]: e.currentTarget.value,
                      },
                    })
                  }
                />
                <button class="btn" onClick={() => removeCustomField(k)}>
                  Remove
                </button>
              </div>
            )}
          </For>
        </div>
        <div style={{ margin: ".75rem 0" }}>
          <button class="btn" onClick={addCustomField}>
            Add Field
          </button>
        </div>

        <div style={{ display: "flex", gap: ".5rem" }}>
          <button
            class="btn primary"
            onClick={() => saveMutation.mutateAsync(current())}
          >
            Save
          </button>
        </div>
      </div>

      <div class="card">
        <h2 style={{ "margin-bottom": "0.75rem" }}>Live Preview</h2>
        <Coupon coupon={current()} />
      </div>

      <div class="card">
        <h2 style={{ "margin-bottom": "0.75rem" }}>
          Page Layout JSON (optional)
        </h2>
        <p style={{ margin: "0 0 .5rem", color: "#475569" }}>
          Define blocks like: <code>{exampleLayoutJson}</code>
        </p>
        <textarea
          style={{ width: "100%", height: "220px" }}
          value={layoutJsonText()}
          onInput={(e) => setLayoutJsonText(e.currentTarget.value)}
        />
        <div style={{ margin: ".75rem 0 0" }}>
          <button
            class="btn primary"
            onClick={() => savePageMutation.mutateAsync()}
          >
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}

const AdminApp = (props: Props): JSX.Element => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AdminBody dealerId={props.dealerId} />
    </QueryClientProvider>
  );
};

export default AdminApp;
