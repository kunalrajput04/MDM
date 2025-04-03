import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  serverUrl: string = environment.imageUrl;

  private eventRecived = new Subject<string>();
  public eventRecived$ = this.eventRecived.asObservable();
  constructor() {}
  private hubConnection: signalR.HubConnection;
  startConnection = (levelName: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('' + this.serverUrl + 'notification')
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('NewUser', levelName))
      .catch((err) => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveEvent', (data) => {
      this.eventRecived.next(data);
    });
  };
}
