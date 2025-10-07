import { JSX, Show, createSignal, onCleanup, onMount } from "solid-js";

export type CouponLayout = "horizontal" | "vertical" | "modal";

export type CouponData = {
  id?: string;
  dealerId: string;
  title: string;
  description: string;
  discountAmount: string;
  expirationDate: string;
  buttonText: string;
  buttonColor: string;
  backgroundImage: string;
  layout: CouponLayout;
  customFields?: Record<string, string>;
};

type Props = {
  coupon: CouponData;
};

export default function Coupon(props: Props): JSX.Element {
  const coupon = () => props.coupon;
  const isModal = () => coupon().layout === "modal";
  const [showModal, setShowModal] = createSignal(!isModal());

  let timer: number | undefined;
  onMount(() => {
    if (isModal()) {
      timer = window.setTimeout(() => setShowModal(true), 800);
    }
  });
  onCleanup(() => {
    if (timer) window.clearTimeout(timer);
  });

  const containerStyle = () => ({
    display: coupon().layout === "horizontal" ? "grid" : "block",
    "grid-template-columns": coupon().layout === "horizontal" ? "1fr 1.2fr" : undefined,
    gap: coupon().layout === "horizontal" ? "1rem" : undefined,
    border: "1px solid #e5e7eb",
    "border-radius": "12px",
    padding: "1rem",
    background: "white",
    "box-shadow": "0 2px 8px rgba(0,0,0,0.06)",
    position: isModal() ? "fixed" : "relative",
    top: isModal() ? "10%" : undefined,
    left: isModal() ? "50%" : undefined,
    transform: isModal() ? "translateX(-50%)" : undefined,
    width: isModal() ? "min(640px, 92vw)" : "auto",
    "z-index": isModal() ? 40 : "auto",
  }) as any;

  const imageStyle = () => ({
    "background-image": coupon().backgroundImage ? `url(${coupon().backgroundImage})` : undefined,
    "background-size": "cover",
    "background-position": "center",
    "border-radius": "10px",
    height: coupon().layout === "horizontal" ? "220px" : "180px",
    margin: coupon().layout === "vertical" ? "0 0 1rem" : undefined,
    background: coupon().backgroundImage ? undefined : "#f1f5f9",
  }) as any;

  const buttonStyle = () => ({
    padding: "0.6rem 1rem",
    border: "1px solid #d4d4d8",
    "border-radius": "8px",
    background: coupon().buttonColor || "#0ea5e9",
    color: "#fff",
    cursor: "pointer",
  }) as any;

  const body = (
    <div style={containerStyle()}>
      <Show when={coupon().layout !== "modal"}>
        <div style={imageStyle()} />
      </Show>
      <div>
        <h3 style={{ margin: "0 0 0.4rem", "font-size": "1.25rem" }}>{coupon().title}</h3>
        <p style={{ margin: "0 0 0.6rem", color: "#334155" }}>{coupon().description}</p>
        <p style={{ margin: "0 0 0.4rem", "font-weight": 600 }}>
          {coupon().discountAmount}
        </p>
        <p style={{ margin: "0 0 0.8rem", color: "#64748b" }}>
          Expires: {coupon().expirationDate || "N/A"}
        </p>

        <Show when={coupon().customFields && Object.keys(coupon().customFields || {}).length > 0}>
          <div style={{ margin: "0 0 0.8rem", "font-size": "0.9rem", color: "#334155" }}>
            {Object.entries(coupon().customFields || {}).map(([k, v]) => (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#475569", width: "140px" }}>{k}</span>
                <span style={{ color: "#0f172a", "font-weight": 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </Show>

        <button style={buttonStyle()}>{coupon().buttonText || "Redeem"}</button>
      </div>
    </div>
  );

  return (
    <Show when={!isModal() || showModal()}>
      {body}
    </Show>
  );
}

