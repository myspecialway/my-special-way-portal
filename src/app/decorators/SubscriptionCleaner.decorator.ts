import { Subscription } from 'rxjs/Subscription';
import { verifyFunction, DEFAULT_HOOK_NAME } from './decorators.utils';

export function SubscriptionCleaner(hookName = DEFAULT_HOOK_NAME): PropertyDecorator {
  return (instance, propertyKey: string) => {
    const oldMethod = verifyFunction(instance.constructor, hookName);

    instance[propertyKey] = new Subscription();
    instance.constructor.prototype[hookName] = function() {
      instance[propertyKey].unsubscribe();
      oldMethod.apply(this, arguments);
    };
  };
}
