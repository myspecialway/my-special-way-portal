export const isFunction = (fn) => typeof fn === 'function';

export const EMPTY_FUNCTION = () => {
  return;
};

export const DEFAULT_HOOK_NAME = 'ngOnDestroy';

export const verifyFunction = (constructor, lifeCycleHook: string) => {
  const method = constructor.prototype[lifeCycleHook];
  if (!isFunction(method)) {
    return EMPTY_FUNCTION;
  } else {
    return method;
  }
};
