import { Injectable } from "@angular/core";

import { SwUpdate } from "@angular/service-worker";
import { MessageService } from "../message/message.service";

@Injectable()
export class PromptUpdateService {

  constructor(updates: SwUpdate, private messageService:MessageService) {
    updates.available.subscribe(event => {
      this.messageService.addUpdateMessage("An update is available for this application. Refresh your browser to update to it!")
      // if (promptUser(event)) {
      //   updates.activateUpdate().then(() => document.location.reload());
      // }
    });
  }
}