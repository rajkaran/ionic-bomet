import { Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { from, fromEvent } from 'rxjs';
import { SubSink } from 'subsink';

import { StorageService } from 'src/app/core/services/storage.service';
import { ProductService } from '../repositories/product.service';
import { Config } from 'src/app/core/models/Config.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  config: Config;

  barcode: string = '';
  eachKeyPress: string = '';
  inFocus: boolean = false;
  isFetching: boolean = false;
  hasConfigured: boolean = false;
  products: any = [];
  searchBy: string = 'upc';
  searchByDropDown: {[key: string]: string}[] = [ {key: 'upc', displayText: 'Product Code'}, {key: 'sn', displayText: 'Supplier No.'} ]
  subsinks: SubSink = new SubSink();

  constructor(
    private barcodeScanner: BarcodeScanner,
    private productService: ProductService,
    public alertController: AlertController,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private storageService: StorageService,
    private zone: NgZone,
    private elementRef: ElementRef
  ) {}

  ngOnInit(){
    this.listenScannerStream();
  }

  // This Ionic lifecycle event will trigger everytime user comes to this page.
  ionViewWillEnter() {
    this.fetchConfig();
    this.elementRef.nativeElement.focus();
  }
   
  // show mesasge to tap before leaving tab
  ionViewWillLeave(){
    this.inFocus = false;
  }

  // fetch configuration from local database
  fetchConfig(){
    this.subsinks.sink = this.storageService.get('config')
    .subscribe( (config: string) => {
      if(config != null){
        this.config = JSON.parse(config);
        this.hasConfigured = true;
      }
      else{
        this.hasConfigured = false;
        this.displaytoastBottom('Not Configured properly...');
      }
    }, (error: any) => {
      this.displaytoastBottom(error.message);
    });
  }

  // Allow user to scan only QR codes. Once a code is scanned call onSubmit method to begin submission
  onScanBarcodeThroughCamera(){
    const barcodeScan = this.barcodeScanner.scan()

    this.subsinks.sink = from(barcodeScan)
    .subscribe( (barcodeData: any) => {
      this.barcode = '';

      if(barcodeData.text != ''){
        this.barcode = barcodeData.text;
      }

      this.onSubmit(); //submit scanned barcode
    }, (error: any) => {
      this.displaytoastBottom(error.message);
    });
  }

  // Track barcode scan event and generate barcode which can be queried
  listenScannerStream() { 
    const ignoreKeys: string[] = ['Unidentified'];

    this.subsinks.sink = fromEvent(this.elementRef.nativeElement, 'keyup')
    .subscribe( (event: KeyboardEvent) => {
      if(!this.isFetching){

        if(event.key == 'Enter'){
          this.zone.run(() => {
            this.barcode = '';
            this.barcode = this.eachKeyPress;
            this.eachKeyPress = '';
            
            this.onSubmit(); //submit scanned barcode
          });
        }
        else{
          if(ignoreKeys.indexOf(event.key) == -1)
            this.eachKeyPress += event.key;
        }
  
      }
    });
  }

  // for environemnt tax add it to final price.
  addEnvironmentTax(price: string, taxAmount: string, specialprix: string){
    let result = parseFloat(price);

    if(specialprix != null){
      result = parseFloat(specialprix);
    }

    if(taxAmount != null){
      result = result+parseFloat(taxAmount)
    }
    
    return result;
  }

  // find display text from search by drop down option list.
  findDropDownDisplayText(key: string){
    const found = this.searchByDropDown.filter( (searchBy: {[key: string]: string}) => searchBy.key === key);
    return (found.length > 0)? found[0].displayText: '';
  }

  // Fetch product details from database on LAN
  onSubmit(){
    this.isFetching = true;
    this.products = [];

    // make sure configuration exist prior to product lookup
    if(this.config != undefined && this.config != null){
      const destination = 'http://'+this.config.scanner.host+':'+this.config.scanner.port;

      this.subsinks.sink = this.productService.fetchProductDetails(this.barcode, this.searchBy, destination)
      .subscribe( (products: any[]) => {
        this.eachKeyPress = '';

        if(products.length > 0){
          this.products = products;
        }

        this.isFetching = false;
      }, (error: any) => {
        this.displaytoastBottom(error.message);
        this.eachKeyPress = '';
        this.isFetching = false;
      });
    }
  }

  // Hide message on screen to tap
  onViewTap(){
    this.inFocus = true
  }

  // display toast at the bottom.
  displaytoastBottom(message: string){
    this.subsinks.sink = from( 
      this.toastCtrl.create({
        message: message,
        duration: 3000,
        icon: 'information-circle',
        buttons: [{ text: 'Done', role: 'cancel' }]
      }) 
    )
    .subscribe( (toast) => {
      toast.present();
    });
  }

  // destroy subscriptions on component destroy
  ngOnDestroy(){
    this.subsinks.unsubscribe();
  }

}
