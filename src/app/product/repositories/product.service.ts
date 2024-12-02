import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicateServerService } from 'src/app/core/rest/communicate-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private communicateServerService: CommunicateServerService) { }

  /**
   * 
   * @param barcode 
   * Fetch product details for a given UPC barcode.
   * @returns 
   */
	fetchProductDetails(barcode: string, type: string, serverOnLAN: string): Observable<any>{
		let url = serverOnLAN+'/find-product';
    url += '?upc='+barcode+'&type='+type;
		return <any>this.communicateServerService.fetchFromDynamicDestination(url);
	}


}
