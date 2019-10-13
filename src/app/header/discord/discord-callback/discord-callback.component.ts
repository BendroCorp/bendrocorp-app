import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-discord-callback',
  templateUrl: './discord-callback.component.html',
  styleUrls: ['./discord-callback.component.css']
})
export class DiscordCallbackComponent implements OnInit {
  codeRequestComplete: boolean = false;
  discordIdentityValid: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    const discordCode = this.activatedRoute.snapshot.queryParams.code
    console.log(discordCode);
    this.userService.discord_identity_start(discordCode).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.discordIdentityValid = true;
        this.userService.refreshData();
      }

      this.codeRequestComplete = true;
    });
  }

}
