import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Radios } from '../../models/radios';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private dbReady = new BehaviorSubject<boolean>(false);
  private database: SQLiteObject;


  constructor(private platform: Platform, public http: HttpClient, private sqlite: SQLite) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'radios.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.createTables(db);

        })

    });

  }


  private createTables(db: SQLiteObject) {

    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS radios (id integer primary key AUTOINCREMENT NOT NULL, name TEXT, url TEXT, thumb TEXT)']
    ])
      .then(() => console.log('tabelas criadas'))
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }


  private isReady() {
    return new Promise((resolve, reject) => {
      if (this.dbReady.getValue()) {
        resolve();
      }
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }


  getAll() {
    return this.isReady()
      .then((data) => {
        let lists = [];
        return this.database.executeSql("SELECT * from radios", [])
          .then((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) {
              lists.push(data.rows.item(i));
            }
            return lists;
          })
      })
  }

  getById(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT top(1)* FROM radios WHERE id = "${id}"`, Object)
          .then((data) => {
            if (data.rows.length) {
              let radio = new Radios();
              radio.id = data.rows.item(0).id;
              radio.name = data.rows.item(0).name;
              radio.url = data.rows.item(0).url;
              radio.thumb = data.rows.item(0).thumb;
              return radio;
            }
            return null;
          })
      })
  }

  add(radio: Radios) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`INSERT INTO radios(name,url,thumb) VALUES ('${radio.name}','${radio.url}','${radio.thumb}');`, {}).then((result) => {
          if (result.insertId) {
            console.log('Radio registrada com sucesso!');
          }
        })
      });
  }

  update(id: number, radio: Radios) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`update radios  set name = ${radio.name}, url = ${radio.url}, thumb = ${radio.thumb} where id = ${id}');`, {}).then((result) => {
          if (result.update) {
            console.log('Radio atualizada com sucesso!');
          }
        })
      });
  }

  delete(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`delete FROM radios where id = ${id}`, []).then((data) => {
          console.log('radios deletada')
          return 'OK';
        })
      })
  }

}
