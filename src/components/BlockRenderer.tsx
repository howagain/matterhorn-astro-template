import { For, JSX, Show } from "solid-js";

export type BlockNode = {
  id?: string;
  type?: string; // e.g. "box" | "text" | "coupon" | custom
  tagName?: string; // fallback tag when no component mapping exists
  props?: Record<string, any>;
  component?: { name: string; options?: Record<string, any> } | null;
  styles?: Record<string, any>;
  children?: BlockNode[];
};

export type ComponentRegistry = Record<
  string,
  (props: Record<string, any>) => JSX.Element
>;

function TextBlock(props: { text?: string; tagName?: string; styles?: any }) {
  const Tag = (props.tagName || "span") as any;
  return <Tag style={props.styles}>{props.text ?? ""}</Tag>;
}

// Very small box/container primitive
function BoxBlock(props: {
  tagName?: string;
  styles?: any;
  children?: JSX.Element;
}) {
  const Tag = (props.tagName || "div") as any;
  return <Tag style={props.styles}>{props.children}</Tag>;
}

export const defaultRegistry: ComponentRegistry = {
  Text: (p) => (
    <TextBlock text={p.text} tagName={p.tagName} styles={p.styles} />
  ),
};

type RendererProps = {
  node: BlockNode;
  registry?: ComponentRegistry;
};

export default function BlockRenderer(props: RendererProps) {
  const registry = () => ({ ...defaultRegistry, ...(props.registry || {}) });
  const n = () => props.node;

  const renderSelf = (): JSX.Element => {
    // 1) Component mapping (builder.io style)
    const compName = n().component?.name;
    if (compName && registry()[compName]) {
      const Comp = registry()[compName]!;
      return (
        <Comp
          {...(n().component?.options || {})}
          tagName={n().tagName}
          styles={n().styles}
        />
      );
    }

    // 2) Fallback to tagName + styles
    return (
      <BoxBlock tagName={n().tagName} styles={n().styles}>
        <Show when={Array.isArray(n().children) && n().children!.length > 0}>
          <For each={n().children}>
            {(c) => <BlockRenderer node={c} registry={registry()} />}
          </For>
        </Show>
      </BoxBlock>
    );
  };

  // If there are children and a mapped component that expects children, wrap them
  const body = renderSelf();
  if (!n().children || n().children.length === 0 || n().component?.name) {
    return body;
  }
  return (
    <BoxBlock tagName={n().tagName} styles={n().styles}>
      {body}
      <For each={n().children}>
        {(c) => <BlockRenderer node={c} registry={registry()} />}
      </For>
    </BoxBlock>
  );
}
