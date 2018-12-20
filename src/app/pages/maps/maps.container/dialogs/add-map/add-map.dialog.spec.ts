import { MatDialogRef, MatDialogModule } from '@angular/material';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddMapDialogComponent } from './add-map.dialog';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { FileUploadModule } from 'ng2-file-upload';

describe('AddMapDialogComponent', () => {
  let mockDialogRef: any;
  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn(),
    };
  });
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, FileUploadModule],
      declarations: [AddMapDialogComponent],
      providers: [
        Apollo,
        HttpClient,
        HttpHandler,
        AuthenticationService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  let fixture: ComponentFixture<AddMapDialogComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapDialogComponent);
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
