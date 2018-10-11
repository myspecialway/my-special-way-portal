import { OnDestroy, OnInit } from '@angular/core';
import { verifyFunction, EMPTY_FUNCTION } from './decorators.utils';

describe('verifyFunction', () => {
  class TestClass implements OnInit, OnDestroy {
    param: string;

    ngOnInit() {
      this.param = 'done';
    }

    ngOnDestroy() {
      this.param = '';
    }
  }
  let instance;

  it('should get the class hook method when hook exists', () => {
    setup();
    const validHookName = 'ngOnInit';
    const method = verifyFunction(instance.constructor, validHookName);

    expect(instance).toHaveProperty(validHookName);
    expect(typeof method).toBe('function');
    expect(method).toEqual(instance.constructor.prototype[validHookName]);
  });

  it('should get a default empty method if class hook is missing', () => {
    setup();
    const missingHookName = 'missingHookName';

    const method = verifyFunction(instance.constructor, missingHookName);

    expect(instance).not.toHaveProperty(missingHookName);
    expect(typeof method).toBe('function');
    expect(method).toEqual(EMPTY_FUNCTION);
  });

  function setup() {
    instance = new TestClass();
  }
});
