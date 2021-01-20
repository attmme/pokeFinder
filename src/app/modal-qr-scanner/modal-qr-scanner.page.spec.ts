import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalQrScannerPage } from './modal-qr-scanner.page';

describe('ModalQrScannerPage', () => {
  let component: ModalQrScannerPage;
  let fixture: ComponentFixture<ModalQrScannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQrScannerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalQrScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
