import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-discord',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.css']
})
export class DiscordComponent implements OnInit, OnDestroy {
  discordOAuthUrl: string = (environment.production) ? 'https://discordapp.com/api/oauth2/authorize?client_id=630786822863061014&redirect_uri=https%3A%2F%2Fmy.bendrocorp.com%2Fdiscord_callback&response_type=code&scope=guilds.join%20email%20identify' : 'https://discordapp.com/api/oauth2/authorize?client_id=630786822863061014&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fdiscord_callback&response_type=code&scope=guilds.join%20email%20identify'
  discordIdentityValid: boolean = false;
  identitySubscription: Subscription;
  constructor(private userService: UserService) { 
    this.identitySubscription = this.userService.dataRefreshAnnounced$.subscribe(() => {
      this.checkIdentity();
    });
  }

  checkIdentity() {
    this.userService.me().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.discordIdentityValid = (results.discord_identity) ? true : false;
      }
    });
  }

  ngOnInit() {
    this.checkIdentity();
  }

  ngOnDestroy() {
    if (this.identitySubscription) {
      this.identitySubscription.unsubscribe();
    }
  }
}
