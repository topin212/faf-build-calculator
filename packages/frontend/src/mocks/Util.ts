export const cartesian: (...arrays: Array<any>) => Array<Array<any>> =
  (...a: Array<any>) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
