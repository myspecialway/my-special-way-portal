import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { DEFAULT_DESTROY_HOOK } from './decorators.utils';
import { SubscriptionCleaner } from './SubscriptionCleaner.decorator';
import { Subject } from 'rxjs';

describe('SubscriptionCleaner', () => {
  const propertKeyName = 'subCollector';
  let instance;

  it(`should assign new Subscription to decorated property "${propertKeyName}"`, () => {
    setup();

    expect(instance[propertKeyName]).toBeInstanceOf(Subscription);
  });

  it(`should initially have one subscription to dispose`, () => {
    setup();
    expect(instance.subCollector._subscriptions).toBeNull();

    const subToAdd = instance.feed$.subscribe(() => {});
    instance.subCollector.add(subToAdd);
    expect(instance.subCollector._subscriptions).not.toBeNull();
    expect(instance.subCollector._subscriptions.length).toBe(1);
  });

  it(`should call unsubscribe once "${DEFAULT_DESTROY_HOOK}" is called`, () => {
    setup();
    const subSpy = jest.spyOn(instance.subCollector, 'unsubscribe');

    instance[DEFAULT_DESTROY_HOOK]();
    expect(subSpy).toHaveBeenCalled();
  });

  it(`should dispose resources held by ${propertKeyName}  once "${DEFAULT_DESTROY_HOOK}" is called`, () => {
    setup();
    expect(instance.subCollector.closed).toBeFalsy();
    let disposed = false;
    const subToAdd = new Subscription(() => {
      disposed = true;
    });
    instance.subCollector.add(subToAdd);
    expect(disposed).toBeFalsy();
    instance[DEFAULT_DESTROY_HOOK]();
    expect(disposed).toBeTruthy();

    expect(instance.subCollector.closed).toBeTruthy();

    expect(instance.subCollector._subscriptions).toBeNull();
  });

  it('should invoke the original hook method as well', () => {
    setup();
    expect(instance.someProperty).toBe('initial');
    instance.ngOnDestroy();
    expect(instance.someProperty).toBe('');
  });

  function setup() {
    class TestClass implements OnDestroy {
      someProperty = 'initial';
      @SubscriptionCleaner()
      subCollector;
      feed$ = new Subject<boolean>();

      ngOnDestroy() {
        this.someProperty = '';
      }
    }
    instance = new TestClass();
  }
});
