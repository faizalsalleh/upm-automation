import { Component } from '@angular/core';
import { LocustService } from '../../services/locust.service';

@Component({
  selector: 'app-load-test',
  templateUrl: './load-test.component.html',
  styleUrls: ['./load-test.component.scss']
})
export class LoadTestComponent {

  constructor(private locustService: LocustService) { }

  onStartTest(userCount: string, spawnRate: string, host: string): void {
    this.locustService.startLoadTest(+userCount, +spawnRate, host).subscribe(response => {
      console.log('Test started:', response);
    });
}

  onStopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      console.log('Test stopped:', response);
    });
  }

  onGetStats(): void {
    this.locustService.getStats().subscribe(stats => {
      console.log('Current stats:', stats);
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe(response => {
      console.log('Stats reset:', response);
    });
  }
}
