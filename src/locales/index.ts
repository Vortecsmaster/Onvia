import { es } from "./es";
export type TextKey = keyof typeof es;
export type TextParams = Record<string, string | number>;
export function isTextKey(value: string): value is TextKey {
  return value in es;
}
export function t(key: TextKey, params: TextParams = {}): string {
  return es[key].replace(/\{(\w+)\}/g, (_, name: string) =>
    String(params[name] ?? `{${name}}`),
  );
}
export function countText(kind: "record" | "place", count: number) {
  return t(`common.${kind}Count.${count === 1 ? "one" : "other"}`, { count });
}
