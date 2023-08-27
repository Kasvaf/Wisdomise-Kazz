export default function makeArray(length: number) {
  return Array.from({ length })
    .fill(undefined)
    .map((_, i) => i);
}
