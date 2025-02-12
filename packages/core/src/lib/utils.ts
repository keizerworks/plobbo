function encodeBase64Bytes(bytes: Uint8Array): string {
  return btoa(
    bytes.reduce((acc, current) => acc + String.fromCharCode(current), ""),
  );
}

export function utf8ToBase64(str: string): string {
  return encodeBase64Bytes(new TextEncoder().encode(str));
}
