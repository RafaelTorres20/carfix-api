export const to = async <T, E = any>(promise: Promise<T>): Promise<[T, E | null]> => {
  return await promise
    .then((data: T) => [data, null] as [T, null])
    .catch((error: E) => [{} as T, error] as [T, E]);
};
