import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { Logger, I18nService, untilDestroyed } from '@app/core';
import { TimelineService } from '@app/timeline/timeline.service';
import { SharedService } from '@app/shared/shared.service';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  videoRequest: any;
  uploader: boolean;
  file: any;

  constructor(
    private titleService: Title,
    private i18nService: I18nService,
    private _timelineService: TimelineService,
    private _sharedService: SharedService,
    private _store: Store<any>,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(
          router.routerState,
          router.routerState.root
        ).join('-');
        this.titleService.setTitle(title);
        window.scrollTo(0, 0);
        // if (router.navigated && !this.uploader) alert('Hello world');
      }
    });

    _store.select('uploader').subscribe(uploader => {
      this.uploader = uploader;
    });
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations
    this.i18nService.init(
      environment.defaultLanguage,
      environment.supportedLanguages
    );

    this._sharedService.sharedMessage.subscribe(requestData => {
      if (requestData) {
        this.videoRequest = requestData;
        this.createFileObject(this.videoRequest.requestData.get('media'));
      }
    });
  }
  // collect that title data properties from all child routes
  getTitle(state: any, parent: any): any {
    let data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  createFileObject(file: any) {
    this.file = {
      data: file,
      progress: 0,
      inProgress: true
    };
    this.trigger();
  }

  trigger() {
    this.dispatcher('PENDING_UPLOAD');
    this._timelineService
      .createVideoPost(this.videoRequest)
      .pipe(
        map((event: any) => {
          console.log(event.type, 'Case event type');
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        })
      )
      .subscribe(
        response => {
          this.dispatcher('COMPLETED_UPLOAD');
        },
        error => {
          console.log(error);
          this.dispatcher('ERROR_UPLOAD');
        }
      );
  }

  dispatcher(type: string) {
    this._store.dispatch({ type: type });
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
