import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {Toast} from "@ionic-native/toast";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the DevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {
  private id: string;
  private _connecting: boolean;
  private device: any;
  private hrObs: Subscription;
  private hr: number;

  constructor(
    private zone: NgZone,
    private ble: BLE,
    private toast: Toast,
    public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get('id');
    console.log(this.id)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePage');
    if (!this.id) return;
    this._connecting = true;
    this.ble.connect(this.id).subscribe(this.onConnected.bind(this), this.onConnectError.bind(this))
  }

  onConnected(device) {
    console.log(device);
    this.toast.showShortBottom('connected ok').subscribe();
    this.zone.run(() => {
      this._connecting = false;
      this.device = device;
    });

    // get hr
    setTimeout(() => {
      console.log('noti')
      let obs = this.ble.startNotification(this.id, '180D', '2A37');
      this.hrObs = obs.subscribe(v => {
        console.log(v);
        this.zone.run(() => this.hr = new Uint8Array(v)[1]);
      }, err => console.error(err));
    }, 1000);
  }

  onConnectError(err) {
    console.error(err);
    this.toast.showShortBottom(err.errorMessage).subscribe();
    this.zone.run(() => {
      this.clear();
    });
  }

  ionViewDidLeave() {
    this.ble.disconnect(this.id)
      .then((data) => console.log(data))
      .catch(err => console.error(err));
    this.clear();
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload')
  }

  clear() {
    this._connecting = false;
    this.device = null;
    this.hr = null;
    if (this.hrObs) this.hrObs.unsubscribe();
  }

}
