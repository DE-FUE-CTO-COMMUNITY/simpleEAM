// Declaration to resolve type incompatibilities in middleware packages
declare namespace Express {
  // Add empty declarations, to resolve type conflicts
  interface Request {}
  interface Response {}
  interface Application {}
}
