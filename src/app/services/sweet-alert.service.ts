import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') {
    Swal.fire(title, text, icon);
  }

  showAlert2(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return Swal.fire(options);
  }
}
