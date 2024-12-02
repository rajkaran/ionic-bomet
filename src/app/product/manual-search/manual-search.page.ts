import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';
import { SubSink } from 'subsink';

import { StorageService } from 'src/app/core/services/storage.service';
import { ProductService } from '../repositories/product.service';
import { Config } from 'src/app/core/models/Config.model';

@Component({
  selector: 'app-manual-search',
  templateUrl: './manual-search.page.html',
  styleUrls: ['./manual-search.page.scss'],
})
export class ManualSearchPage implements OnInit {
  @ViewChild('manualSearchBox') manualSearchBox: ElementRef;

  manualSearchForm: FormGroup;
  product: any;
  config: Config;

  isFetching: boolean = false;
  hasConfigured: boolean = false;
  products: any = [];
  searchByDropDown: {[key: string]: string}[] = [ {key: 'upc', displayText: 'Product Code'}, {key: 'sn', displayText: 'Supplier No.'} ]
  subsinks: SubSink = new SubSink();

  constructor(
    private productService: ProductService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private storageService: StorageService,
  ) {}

  ngOnInit(){
    this.onManualSearchFormInit();
  }

  // This Ionic lifecycle event will trigger everytime user comes to this page.
  ionViewWillEnter() {
    this.fetchConfig();
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

  // Initiate manualSearchForm
  onManualSearchFormInit(){
    this.manualSearchForm = new FormGroup({
      barcode: new FormControl(''),
      type: new FormControl('sn')
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
    this.product = undefined;
    this.products = [];

    // make sure configuration exist prior to product lookup
    if(this.config != undefined && this.config != null){
      const destination = 'http://'+this.config.scanner.host+':'+this.config.scanner.port;

      this.subsinks.sink = this.productService.fetchProductDetails(this.manualSearchForm.value.barcode, this.manualSearchForm.value.type, destination)
      .subscribe( (products: any[]) => {

        if(products.length == 1){
          this.product = products[0];
        }
        else if(products.length > 1){
          this.products = products;
        }

        this.isFetching = false;
      }, (error: any) => {
        this.displaytoastBottom(error.message);
        this.isFetching = false;
      });
    }
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
