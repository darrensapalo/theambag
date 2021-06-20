export function isNullOrUndefined<E>(
  object: E | null | undefined
): object is null | undefined {
  return object === null || object === undefined;
}
