declare module '@react-three/fiber' {
  export function Canvas(props: any): JSX.Element;
}

declare module '@react-three/drei' {
  export const OrbitControls: (props: any) => JSX.Element | null;
  export const Environment: (props: any) => JSX.Element | null;
  export const Text3D: (props: any) => JSX.Element | null;
  export const Center: (props: any) => JSX.Element | null;
  export const Float: (props: any) => JSX.Element | null;
  export const PerspectiveCamera: (props: any) => JSX.Element | null;
}
