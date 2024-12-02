import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private storageReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(cordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
    this.storageReady.next(true);
  }

  /**
   * 
   * @param key 
   * @param value 
   * Set a new key-value pair or update an existing one if key is same.
   * @returns 
   */
  public set(key: string, value: any) {
    return from(this._storage?.set(key, value));
  }

  /**
   * 
   * @param key 
   * retrieve value stored in storage for a given key.
   * @returns 
   */
  public get(key: string) {
    return this.storageReady
    .pipe(
      filter( ready => ready),
      switchMap( () => {
        return from(this._storage?.get(key)) || of(null);
      })
    );
  }

  /**
   * 
   * @param key 
   * remove a key-value pair for given key
   * @returns 
   */
  public remove(key: string){
    return from(this._storage?.remove(key));
  }

}
