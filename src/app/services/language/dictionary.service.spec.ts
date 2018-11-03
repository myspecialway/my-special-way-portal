import { DictionaryService } from './dictionary.service';
import { TranslateService } from '@ngx-translate/core';

describe('dictionary Service', () => {
  let dictionaryService: DictionaryService;
  beforeEach(() => {
    //dictionaryService = new DictionaryService();
  });
  it('should be defined', () => {
    expect(dictionaryService).toBeDefined();
  });
});
