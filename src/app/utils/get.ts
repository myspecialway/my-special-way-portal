export class Get {
  static getNumber(object: object, path: string): number | undefined {
    return Get.getValue(object, path, 'number');
  }

  static getString(object: object, path: string): string | undefined {
    return Get.getValue(object, path, 'string');
  }

  static getBoolean(object: object, path: string): boolean | undefined {
    return Get.getValue(object, path, 'boolean');
  }

  static getObject(object: object, path: string): object | undefined {
    return Get.getValue(object, path, 'object');
  }

  static getArray(object: object, path: string): object | undefined {
    return Get.getValue(object, path, 'array');
  }

  static getSymbol(object: object, path: string): symbol | undefined {
    return Get.getValue(object, path, 'symbol');
  }

  /**
   * Gets the value at path of object.  If the resolved value is undefined, returns undefined.
   * If type is specified, compares the value type to the given type, if match returns the value, otherwise, returns undefined.
   */
  static getValue<T>(object: object, path: string, tp?: string): T | undefined {
    const value = Get.getit(object, path);

    if (value === undefined || !tp) {
      return value;
    }

    if (tp && (typeof value === tp.toLowerCase() || (tp.toLowerCase() === 'array' && Array.isArray(value)))) {
      return value;
    } else {
      // console.warn('Get.getValue: input type mismatch; expected ' + tp + ' but found ' + typeof value);
    }

    return undefined;
  }

  private static getit(data: object, path: string): any {
    const pathAarray = path.replace(/\[([0-9]*)]/gim, '.$1').split('.');
    return pathAarray.reduce((prev: any, next: any) => {
      if (!prev) {
        return undefined;
      }
      return prev[next];
    }, data);
  }
}
