import {Component, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { BLE } from "@ionic-native/ble";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  _scanning: boolean;
  devices: any[];

  constructor(
    private zone: NgZone,
    private ble: BLE,
    private toast: Toast,
    public navCtrl: NavController) {

  }

  startScan() {
    console.log('xxx');
    this._scanning = true;
    this.devices = [];

    this.toast.showShortBottom("start scanning 😀").subscribe();
    this.ble.scan([], 5).subscribe(device => {
      console.log(device);
      this.zone.run(() => {
        this.devices.push(device);
      })
    });

    setTimeout(() => {
      this._scanning = false;
    }, 5000);

  }

  goDevice(mac) {
    this.navCtrl.push("DevicePage", {
      id: mac
    })
  }



}
