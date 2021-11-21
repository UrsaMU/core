/**
 * Create an interpolation from a plain string.
 * @param str The String to interpolate
 * @param scope The object where values are defined for variables within the context
 * of the string scope.
 * @example
 * const results = interpolate("Hello $(arg1}!", {arg1: "world"});
 * // results = "Hello world!"
 * @returns
 */
export const interpolate = (
  str: string,
  scope: { [key: string]: any }
): string => {
  return new Function(...Object.keys(scope), `return \`${str}\';`)(
    ...Object.values(scope)
  );
};
