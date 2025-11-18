// TypeScript declarations for Hypher library
declare module 'hypher' {
  interface HypherOptions {
    minLength?: number
    minLeftLength?: number
    minRightLength?: number
  }

  class Hypher {
    constructor(patterns: any, options?: HypherOptions)
    hyphenate(word: string): string[]
    hyphenateText(text: string): string
  }

  export = Hypher
}

declare module 'hyphenation.de' {
  const patterns: any
  export = patterns
}

declare module 'hyphenation.en-us' {
  const patterns: any
  export = patterns
}
