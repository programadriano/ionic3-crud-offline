import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SobrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html',
})
export class SobrePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let id = navParams.get('id');
    let name = navParams.get('name');
    console.log(id);
    console.log(name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SobrePage');
  }

}
