export interface FetchOptions {
  method?: string,
  headers? : Headers,
  body?: Blob | BufferSource | FormData | URLSearchParams | ReadableStream,
  mode?: 'cors' | 'no-cors' | 'same-origin',
  credentials?: 'omit' | 'same-origin' | 'include',
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached',
  redirect?: 'follow' | 'error' | 'manual',
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url',
  integrity?: string,
  keepalive?: boolean,
  signal?: AbortSignal
}
