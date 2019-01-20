import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class CommunicationService<T> {
  handlingMsgDataChanged: EventEmitter<T> = new EventEmitter<T>();
  subscribeParantChanged(onSuccess, onError) {
    this.handlingMsgDataChanged.subscribe(onSuccess, onError);
  }

  emitEvent(value: T) {
    this.handlingMsgDataChanged.emit(value);
  }

  constructor() {}
}
