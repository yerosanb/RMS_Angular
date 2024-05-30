import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}
  handleError(error: unknown) {
    this.zone.run(() => {
      // if((error as any).message )
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
      console.log(`Caught by custom error handler: `, (error as any).message);
    });
  }
}
