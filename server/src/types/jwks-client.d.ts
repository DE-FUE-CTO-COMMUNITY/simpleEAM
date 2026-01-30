declare module 'jwks-client' {
  interface JwksClientOptions {
    jwksUri: string
    requestHeaders?: any
    timeout?: number
    cache?: boolean
    cacheMaxEntries?: number
    cacheMaxAge?: number
  }

  interface SigningKey {
    getPublicKey(): string
  }

  interface JwksClient {
    getSigningKey(kid: string, callback: (err: any, key?: SigningKey) => void): void
  }

  function jwksClient(options: JwksClientOptions): JwksClient
  export = jwksClient
}
