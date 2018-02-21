import { Component, OnInit } from '@angular/core';
import {CheckinService} from '../services/checkin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  checkins: any[];
  adminPanelState: string = 'data';

  constructor(private checkinService: CheckinService) {}

  ngOnInit() {

    this.checkinService.getSignIns({})
      .subscribe(
        (response) => {
          this.checkins = response;
        }
      );
  }

}
