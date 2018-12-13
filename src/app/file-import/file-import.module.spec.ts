import { FileImportModule } from './file-import.module';

describe('FileImportModule', () => {
  let fileImportModule: FileImportModule;

  beforeEach(() => {
    fileImportModule = new FileImportModule();
  });

  it('should create an instance', () => {
    expect(fileImportModule).toBeTruthy();
  });
});
