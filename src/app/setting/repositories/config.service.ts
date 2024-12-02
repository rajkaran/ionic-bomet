import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicateServerService } from 'src/app/core/rest/communicate-server.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private communicateServerService: CommunicateServerService) { }

  /**
   * 
   * @param serverOnLAN 
   * Ping ExpressJS server to make sure it's running
   * @returns 
   */
	pingServer(serverOnLAN: string): Observable<any>{
		let url = serverOnLAN;
		return <any>this.communicateServerService.fetchFromDynamicDestination(url);
	}


}
