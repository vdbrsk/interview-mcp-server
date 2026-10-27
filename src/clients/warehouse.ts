// Stub: the real client would run the statement on the warehouse under the caller's identity.
export async function runSelect(sql: string): Promise<Record<string, unknown>[]> {
  return [{ stub: true, sql }];
}
