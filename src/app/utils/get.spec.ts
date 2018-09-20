'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
import * as get_1 from './get';

describe('Get', () => {
  const MOCK_SYMBOL = Symbol(42);
  const data = {
    id: 1233,
    symbol: MOCK_SYMBOL,
    name: 'Dan',
    married: true,
    hobbies: ['football', 'reading'],
    address: {
      street: 'Kaplan 4',
      city: 'Tel-Aviv',
      zip: 654321,
      inIsrael: true,
      phones: {
        homePhone: '03-9876543',
        workPhone: '03-9876567',
        mobile: '054-9987656',
        vendors: ['samsung', 'iphone5'],
      },
    },
    children: [{ name: 'Joe', age: 12 }, { name: 'Mike', age: 7 }, { name: 'Kate', age: 3 }],
  };
  // Number
  it('should get the id number correctly', () => {
    const value = get_1.Get.getNumber(data, 'id');
    expect(value).toBe(1233);
  });
  it('should get the inner zip number correctly', () => {
    const value = get_1.Get.getNumber(data, 'address.zip');
    expect(value).toBe(654321);
  });
  it('should get undefined on not found number property', () => {
    const value = get_1.Get.getNumber(data, 'id1');
    expect(value).toBe(undefined);
  });
  it('should get undefined on mismatch type with number', () => {
    const value = get_1.Get.getNumber(data, 'name');
    expect(value).toBe(undefined);
  });
  // String
  it('should get the name string correctly', () => {
    const value = get_1.Get.getString(data, 'name');
    expect(value).toBe('Dan');
  });
  it('should get the inner city string correctly', () => {
    const value = get_1.Get.getString(data, 'address.city');
    expect(value).toBe('Tel-Aviv');
  });
  it('should get undefined on not found string property', () => {
    const value = get_1.Get.getString(data, 'name1');
    expect(value).toBe(undefined);
  });
  it('should get undefined on mismatch type with string', () => {
    const value = get_1.Get.getString(data, 'id');
    expect(value).toBe(undefined);
  });
  // Boolean
  it('should get the married boolean correctly', () => {
    const value = get_1.Get.getBoolean(data, 'married');
    expect(value).toBe(true);
  });
  it('should get the inner inIsrael boolean correctly', () => {
    const value = get_1.Get.getBoolean(data, 'address.inIsrael');
    expect(value).toBe(true);
  });
  it('should get undefined on not found boolean property', () => {
    const value = get_1.Get.getBoolean(data, 'name1');
    expect(value).toBe(undefined);
  });
  it('should get undefined on mismatch type with boolean', () => {
    const value = get_1.Get.getBoolean(data, 'id');
    expect(value).toBe(undefined);
  });
  // Symbol
  it('should get the symbol correctly', () => {
    const value = get_1.Get.getSymbol(data, 'symbol');
    expect(value).toBe(MOCK_SYMBOL);
  });
  // Object
  it('should get the address object correctly', () => {
    const value = get_1.Get.getObject(data, 'address');
    expect(value).toEqual({
      street: 'Kaplan 4',
      city: 'Tel-Aviv',
      zip: 654321,
      inIsrael: true,
      phones: {
        homePhone: '03-9876543',
        mobile: '054-9987656',
        vendors: ['samsung', 'iphone5'],
        workPhone: '03-9876567',
      },
    });
  });
  it('should get the inner phones object correctly', () => {
    const value = get_1.Get.getObject(data, 'address.phones');
    expect(value).toEqual({
      homePhone: '03-9876543',
      workPhone: '03-9876567',
      mobile: '054-9987656',
      vendors: ['samsung', 'iphone5'],
    });
  });
  it('should get undefined on not found object property', () => {
    const value = get_1.Get.getObject(data, 'address.phones.other');
    expect(value).toBe(undefined);
  });
  it('should get undefined on mismatch type with object', () => {
    const value = get_1.Get.getObject(data, 'id');
    expect(value).toBe(undefined);
  });
  // Array
  it('should get the hobbies array correctly', () => {
    const value = get_1.Get.getArray(data, 'hobbies');
    expect(value).toEqual(['football', 'reading']);
  });
  it('should get the inner vendors array correctly', () => {
    const value = get_1.Get.getArray(data, 'address.phones.vendors');
    expect(value).toEqual(['samsung', 'iphone5']);
  });
  it('should get undefined on not found array property', () => {
    const value = get_1.Get.getArray(data, 'address.phones.other');
    expect(value).toBe(undefined);
  });
  it('should get undefined on mismatch type with array', () => {
    const value = get_1.Get.getArray(data, 'id');
    expect(value).toBe(undefined);
  });
  // Generic
  it('should get the name string correctly from inner object using array index', () => {
    const value = get_1.Get.getValue(data, 'children[0].name', 'string');
    expect(value).toBe('Joe');
  });
  it('should get the children array correctly', () => {
    const value = get_1.Get.getValue(data, 'children', 'array');
    if (value) {
      expect(value.length).toBe(3);
    }
  });
  it('should get the name string correctly without giving type', () => {
    const value = get_1.Get.getValue(data, 'name');
    expect(value).toBe('Dan');
  });
  it('should get the undefined with non-path argument', () => {
    const value = get_1.Get.getValue(data, 'name-1/ok.array');
    expect(value).toBe(undefined);
  });
});
