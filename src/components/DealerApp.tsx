import { type JSX } from "solid-js";
import {
  createQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/solid-query";
import Coupon, { type CouponData } from "@components/Coupon";
import { Show } from "solid-js";
import BlockRenderer, {
  type BlockNode,
  type ComponentRegistry,
} from "@components/BlockRenderer";

type Props = { dealerId: string };

function DealerBody(props: Props): JSX.Element {
  const couponsQuery = createQuery(() => ({
    queryKey: ["coupons", props.dealerId],
    queryFn: async (): Promise<CouponData[]> => {
      const res = await fetch(
        `/api/coupons/${encodeURIComponent(props.dealerId)}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return (await res.json()) as CouponData[];
    },
  }));

  const first = () => couponsQuery.data?.[0];
  const pageQuery = createQuery(() => ({
    queryKey: ["page", props.dealerId],
    queryFn: async () => {
      const res = await fetch(
        `/api/pages/${encodeURIComponent(props.dealerId)}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return await res.json();
    },
  }));

  function RenderPage(props: { coupons: CouponData[]; page: any }) {
    const getCouponById = (id: string) =>
      props.coupons.find((c) => c.id === id);
    const root = () =>
      props.page?.layoutJson as { blocks?: BlockNode[] } | undefined;

    const registry: ComponentRegistry = {
      Coupon: (p) => {
        const c = p.coupon_id ? getCouponById(String(p.coupon_id)) : undefined;
        return c ? (
          <Coupon coupon={c} />
        ) : (
          <div style={{ color: "#dc2626" }}>Coupon not found</div>
        );
      },
      Text: (p) => <span style={p.styles}>{p.text}</span>,
      Box: (p) => <div style={p.styles}>{p.children}</div>,
    };

    const nodes = root()?.blocks || [];
    if (nodes.length > 0) {
      return (
        <div
          style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}
        >
          {nodes.map((n) => (
            <BlockRenderer node={n} registry={registry} />
          ))}
        </div>
      );
    }
    const first = props.coupons[0];
    return first ? (
      <Coupon coupon={first} />
    ) : (
      <p>No coupons configured yet.</p>
    );
  }

  return (
    <div class="page">
      <Show
        when={!couponsQuery.isLoading && !pageQuery.isLoading}
        fallback={<p>Loading…</p>}
      >
        <Show
          when={!couponsQuery.error && !pageQuery.error}
          fallback={
            <p style={{ color: "#dc2626" }}>
              {String(couponsQuery.error || pageQuery.error)}
            </p>
          }
        >
          <RenderPage coupons={couponsQuery.data || []} page={pageQuery.data} />
        </Show>
      </Show>
    </div>
  );
}

const DealerApp = (props: Props): JSX.Element => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DealerBody dealerId={props.dealerId} />
    </QueryClientProvider>
  );
};

export default DealerApp;
