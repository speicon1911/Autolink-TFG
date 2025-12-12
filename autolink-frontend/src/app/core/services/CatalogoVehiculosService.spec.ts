import { TestBed } from '@angular/core/testing';

import { CatalogoVehiculosService } from './CatalogoVehiculosService';

describe('Vehiculos', () => {
  let service: CatalogoVehiculosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoVehiculosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
