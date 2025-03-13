// src/types/pinch-zoom.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'pinch-zoom': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      className?: string;
      style?: React.CSSProperties;
    };
  }
}
