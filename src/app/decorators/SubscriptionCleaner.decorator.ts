import { Subscription } from 'rxjs/Subscription';
import { verifyFunction, DEFAULT_INIT_HOOK, DEFAULT_DESTROY_HOOK } from './decorators.utils';

export function SubscriptionCleaner(
  initHook = DEFAULT_INIT_HOOK,
  destroyHook = DEFAULT_DESTROY_HOOK,
): PropertyDecorator {
  return (instance, propertyName: string) => {
    const originalNGonInit = verifyFunction(instance.constructor, initHook);
    const originalNGonDestroy = verifyFunction(instance.constructor, destroyHook);

    instance.constructor.prototype[initHook] = function(...args) {
      this[propertyName] = new Subscription();
      originalNGonInit.apply(this, args);
    };
    instance.constructor.prototype[destroyHook] = function(...args) {
      if (this[propertyName]) {
        this[propertyName].unsubscribe();
      }
      originalNGonDestroy.apply(this, args);
    };
  };
}
