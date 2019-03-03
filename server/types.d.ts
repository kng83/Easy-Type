export type Maybe<T> = T | null;

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  hello?: Maybe<string>;

  whatYourName?: Maybe<string>;

  itsNice?: Maybe<boolean>;
}

// ====================================================
// Arguments
// ====================================================
