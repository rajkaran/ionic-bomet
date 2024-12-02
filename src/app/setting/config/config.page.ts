import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { Config } from 'src/app/core/models/Config.model';
import { SubSink } from 'subsink';
import { from, of } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { ConfigService } from '../repositories/config.service';
import { concatMap, filter } from 'rxjs/operators';
import { ProductService } from 'src/app/product/repositories/product.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  configForm: FormGroup;

  handlerMessage = '';
  roleMessage = '';

  isPinging: boolean = false;
  
  passphrase: number = 5011055;
  stores: {key: string, displayText: string}[] = [
    {key: 'any', displayText: 'Any'},
    {key: 'store1', displayText: 'Store 1'},
    {key: 'store2', displayText: 'Store 2'}
  ];
  subsinks: SubSink = new SubSink();
  version: string = 'V1.0';

  constructor(
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private configService: ConfigService,
    private appVersion: AppVersion,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initConfigForm();

    this.subsinks.sink = from(this.appVersion.getVersionNumber())
    .subscribe( (version: string) => {
      this.version = 'V'+version;
    });
  }

  // This Ionic lifecycle event will trigger everytime user comes to this page.
  ionViewWillEnter() {
    this.fetchConfig();
  }

  // initialize configForm
  initConfigForm(){
    this.configForm = new FormGroup({
      accessDriver: new FormControl(''),
      accessFile: new FormControl(''),
      store: new FormControl('any'),
      showScanButton: new FormControl(false),
      scanner: new FormGroup({
        host: new FormControl('', Validators.required),
        port: new FormControl('', Validators.required),
        mdbReaderLoc: new FormControl('')
      })
    });
  }

  // fetch configuration from local database
  fetchConfig(){
    this.subsinks.sink = this.storageService.get('config')
    .subscribe( (config: string) => {
      if(config != null){
        this.updateConfigForm(JSON.parse(config));
      }
    }, (error: any) => {
      this.displaytoastBottom(error.message);
    });
  }

  /**
   * 
   * @param storeConfig 
   * Update configForm with configuration retrived from local database.
   */
  updateConfigForm(storeConfig: Config){
    this.configForm.patchValue({
      accessDriver: storeConfig.accessDriver,
      accessFile: storeConfig.accessFile,
      store: storeConfig.store,
      showScanButton: storeConfig.showScanButton,
      scanner: {
        host: storeConfig.scanner.host,
        port: storeConfig.scanner.port,
        mdbReaderLoc: storeConfig.scanner.mdbReaderLoc
      }
    });
  }

  /**
   * 
   * @param storeConfig 
   * reset configForm to default
   */
  resetConfigForm(){
    this.configForm.patchValue({
      accessDriver: '',
      accessFile: '',
      scanner: {
        host: '',
        port: '',
        mdbReaderLoc: ''
      }
    });

    this.configForm.reset();
  }

  // Remove all configurations from storage
  removeFromStorage(){
    this.subsinks.sink = from(this.confirmationBox('Are you sure you want to REMOVE settings', '', 'Enter 7 digit Authentication Code to confirm your action.'))
      .pipe(
        filter( (authentication: {code: string}) => authentication !== undefined),
        filter( (authentication: {code: string}) => {
          if(parseInt(authentication.code) !== this.passphrase){
            this.displaytoastBottom('Invalid Authentication Code provided...');
            return false;
          }

          return true;
        }),
        concatMap( () => this.storageService.remove('config') )
      )
    .subscribe( (response: undefined) => {
      this.resetConfigForm();
      this.displaytoastBottom('Configuration has been removed...');
    }, (error: any) => {
      this.displaytoastBottom(error.message);
    });
  }

  // Test Connection with server info provided in config.
  testConnection(){
    if(this.configForm.value.scanner.host){
      this.isPinging = true;
      let destination = 'http://'+this.configForm.value.scanner.host;

      if(this.configForm.value.scanner.port != ''){
        destination += ':'+this.configForm.value.scanner.port;
      }

      this.subsinks.sink = this.configService.pingServer(destination)
      .subscribe( (response: any) => {
        this.isPinging = false;
        this.displaytoastBottom('Found server at '+destination);
      }, (error: any) => {
        this.isPinging = false;
        this.displaytoastBottom('Can\'t reach server at '+destination);
      });
    }
  }

  // Save configuration changes to local database.
  onSubmit(){
    if(this.configForm.valid){
      this.subsinks.sink = from(this.confirmationBox('Are you sure you want to MODIFY settings', '', 'Enter 7 digit Authentication Code to confirm your action.'))
      .pipe(
        filter( (authentication: {code: string}) => authentication !== undefined),
        filter( (authentication: {code: string}) => {
          if(parseInt(authentication.code) !== this.passphrase){
            this.displaytoastBottom('Invalid Authentication Code provided...');
            return false;
          }

          return true;
        }),
        concatMap( () => this.storageService.set('config', JSON.stringify(this.configForm.value)) )
      )
      .subscribe( (dataStored: string) => {
        this.displaytoastBottom('Configuration is saved...');
      }, (error: any) => {
        this.displaytoastBottom(error.message);
      });
    }
  }

  /**
   * 
   * @param header 
   * @param subHeader 
   * @param message 
   * Create an Alert box with an input text to present a confirmation box to end user.
   * https://www.freakyjolly.com/ionic-alert-this-alertcontroller-create/
   * https://www.9lessons.info/2019/11/ionic-angular-update-delete-rxjs.html
   * @returns Promise<{code: string}>
   */
  async confirmationBox(header: string, subHeader: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
        },
        {
          text: 'SUBMIT',
          role: 'confirm',
        },
      ],
      inputs: [
        {
          placeholder: 'Authentication Code',
          name: 'code',
          label: 'Code',
          type: 'number'
        }
      ]
    });

    await alert.present();

    const { data, role } = await alert.onDidDismiss();
    return (role === 'confirm')? data.values: undefined; 
  }

  // display toast at the bottom.
  displaytoastBottom(message: string){
    this.subsinks.sink = from( 
      this.toastCtrl.create({
        message: message,
        duration: 2000,
        icon: 'information-circle',
        buttons: [
          {
            text: 'Done',
            role: 'cancel'
          }
        ]
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
