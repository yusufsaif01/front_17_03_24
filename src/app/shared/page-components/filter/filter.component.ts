import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Constants } from '@app/shared/static-data/static-data';
import { SharedService } from '@app/shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from '@app/core';
import { FilterService } from './filter.service';
import { AdminService } from '@app/admin/admin.service';
import { MatMenu } from '@angular/material';

interface ActiveClass {
  activePosition: boolean;
  activePlayerCategory: boolean;
  activeAge: boolean;
  activeLocation: boolean;
  activeStrongFoot: boolean;
  activeTeamTypes: boolean;
  activeAbility: boolean;
  activeStatus: boolean;
}

interface LocationRangeFilters {
  countryData: any[];
  positions: any[];
  playerType: any[];
  ageRange: any[];
  strongFoot: any[];
  states: any[];
  districts: any[];
  teamTypes: any[];
  status: any[];
  ability: any[];
  positionsArray: any[];
  playerTypeArray: any[];
  ageRangeArray: any[];
  strongFootArray: any[];
  teamTypesArray: any[];
  statusArray: any[];
  abilityArray: any[];
}

interface LocationsIds {
  countryID: string;
  stateID: string;
  countryValue: string;
  stateValue: string;
  districtValue: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  filter: any = {};
  // switchClass: ActiveClass;
  locationRangeFilters: LocationRangeFilters;
  locationData: LocationsIds;
  // checkFilters: boolean | undefined = undefined;
  @Input() allowedFilters = {
    position: false,
    playerCategory: false,
    age: false,
    location: false,
    strongFoot: false,
    teamTypes: false,
    ability: false,
    status: false
  };
  showFilter = false;

  @Output() filterChanges: EventEmitter<any> = new EventEmitter();
  @ViewChildren(
    'position, playercategory, age, location, strongfoot, teamTypes, ability, status'
  )
  templates: QueryList<MatMenu>;

  // buttons: any[] = [];
  // filterData: any[] = [
  //   {
  //     allowedFilters: 'position',
  //     switchClass: 'activePosition',
  //     filterName: 'Position'
  //   },
  //   {
  //     allowedFilters: 'playerCategory',
  //     switchClass: 'activePlayerCategory',
  //     filterName: 'Player Category'
  //   },
  //   {
  //     allowedFilters: 'age',
  //     switchClass: 'activeAge',
  //     filterName: 'Age'
  //   },
  //   {
  //     allowedFilters: 'location',
  //     switchClass: 'activeLocation',
  //     filterName: 'Location'
  //   },
  //   {
  //     allowedFilters: 'strongFoot',
  //     switchClass: 'activeStrongFoot',
  //     filterName: 'Strong Foot'
  //   },
  //   {
  //     allowedFilters: 'status',
  //     switchClass: 'activeStatus',
  //     filterName: 'Status'
  //   },
  //   {
  //     allowedFilters: 'ability',
  //     switchClass: 'activeAbility',
  //     filterName: 'Ability'
  //   },
  //   {
  //     allowedFilters: 'teamTypes',
  //     switchClass: 'activeTeamTypes',
  //     filterName: 'Types Of Teams'
  //   }
  // ];

  constructor(
    private _toastrService: ToastrService,
    private _sharedService: SharedService,
    private _filterService: FilterService,
    private _adminService: AdminService
  ) {}

  ngOnInit() {
    this.initialize();
    // this.deactivateAll();
    this.getLocationStats();
    this.getAbilityList();
    this.getFilterDisplayValue();
  }

  // ngAfterViewInit() {
  //   this.filterData.forEach((filter: any) => {
  //     this.buttons.push(filter);
  //   });
  //   this.templates.forEach((el: any, index: number) => {
  //     this.buttons[index].matMenu = el;
  //   });
  // }

  getFilterDisplayValue() {
    this._sharedService
      .getFilterDisplayValue()
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.showFilter = value;
      });
  }

  closeFilter() {
    this._sharedService.setFilterDisplayValue(false);
    this.getFilterDisplayValue();
  }

  getAbilityList() {
    this._adminService
      .getAbilityList()
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          let records = response.data.records;
          this.locationRangeFilters.ability = records;
        },
        error => {
          this._toastrService.error(error.error.message, 'Error');
        }
      );
  }

  // deactivateAll() {
  //   this.switchClass = {
  //     activePosition: false,
  //     activePlayerCategory: false,
  //     activeAge: false,
  //     activeLocation: false,
  //     activeStrongFoot: false,
  //     activeTeamTypes: false,
  //     activeAbility: false,
  //     activeStatus: false
  //   };
  // }

  initialize() {
    this.locationRangeFilters = {
      countryData: [],
      positions: [],
      playerType: [],
      ageRange: [],
      strongFoot: [],
      states: [],
      districts: [],
      teamTypes: [],
      status: [],
      ability: [],
      positionsArray: [],
      playerTypeArray: [],
      ageRangeArray: [],
      strongFootArray: [],
      teamTypesArray: [],
      statusArray: [],
      abilityArray: []
    };
    this.locationData = {
      countryID: '',
      stateID: '',
      countryValue: '',
      stateValue: '',
      districtValue: ''
    };
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.locationRangeFilters.strongFoot = Constants.STRONG_FOOT;
    this.locationRangeFilters.ageRange = Constants.AGE_RANGE;
    this.locationRangeFilters.playerType = Constants.PLAYER_TYPE;
    this.locationRangeFilters.status = Constants.STATUS;
    if (localStorage.getItem('member_type') === 'academy') {
      this.locationRangeFilters.teamTypes = Constants.ACADEMY_TEAM_TYPES;
    }
    if (localStorage.getItem('member_type') === 'club') {
      this.locationRangeFilters.teamTypes = Constants.CLUB_TEAM_TYPES;
    }
    this.getPositionsListing();
  }

  onSelectCountry(event: any) {
    if (event.target.value) {
      let countryData = JSON.parse(event.target.value);
      this.locationData.countryID = countryData.country_id;
      this.getStatesListing(this.locationData.countryID);
      this.filter.country = countryData.country;
    } else {
      this.locationRangeFilters.districts = [];
      this.locationRangeFilters.states = [];
      delete this.filter.country;
      delete this.filter.state;
      delete this.filter.district;
    }
    this.filterChanges.emit(this.filter);
  }

  onSelectState(event: any) {
    if (event.target.value) {
      let stateData = JSON.parse(event.target.value);
      this.locationData.stateID = stateData.id;
      this.getDistrictsListing(
        this.locationData.countryID,
        this.locationData.stateID
      );
      this.filter.state = stateData.name;
    } else {
      this.locationRangeFilters.districts = [];
      delete this.filter.state;
    }
    this.filterChanges.emit(this.filter);
  }

  onSelectDistrict(event: any) {
    if (event.target.value) {
      let districtData = JSON.parse(event.target.value);
      this.filter.district = districtData.name;
    } else {
      delete this.filter.district;
    }
    this.filterChanges.emit(this.filter);
  }

  getLocationStats() {
    this._sharedService
      .getLocationStats()
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.locationRangeFilters.countryData = response.data;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  getStatesListing(countryID: string) {
    this._sharedService
      .getStatesListing(countryID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.locationRangeFilters.states = response.data.records;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  getDistrictsListing(countryID: string, stateID: string) {
    this._sharedService
      .getDistrictsList(countryID, stateID, { page_size: 85 })
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.locationRangeFilters.districts = response.data.records;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  // addActiveClass(className: any) {
  //   this.deactivateAll();
  //   this.switchClass[className] = true;
  // }

  ngOnDestroy() {}

  getPositionsListing() {
    this._filterService
      .getPositionsListing()
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.locationRangeFilters.positions = response.data.records;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  getCountryValue(country: any) {
    if (country) {
      return JSON.stringify(country);
    } else return '';
  }

  getStateValue(state: any) {
    if (state) {
      return JSON.stringify(state);
    } else return '';
  }

  getDistrictValue(district: any) {
    if (district) {
      return JSON.stringify(district);
    } else return '';
  }

  onChangeChecker(event: any, filterArray: any, type: string) {
    let entityName: any = event.source.value;
    if (event.checked) {
      // if (this.checkFilters === false) this.checkFilters = undefined;
      if (!filterArray.includes(entityName)) {
        filterArray.push(entityName);
      }
    } else {
      filterArray.forEach((element: any, index: number) => {
        if (element == entityName) {
          filterArray.splice(index, 1);
        }
      });
    }
    this.filter[type] = filterArray.join(',');
    this.filterChanges.emit(this.filter);
  }

  clearFilters() {
    this.filter = {};
    // this.deactivateAll();
    // this.checkFilters = false;
    this.locationRangeFilters.positionsArray = [];
    this.locationRangeFilters.playerTypeArray = [];
    this.locationRangeFilters.ageRangeArray = [];
    this.locationRangeFilters.strongFootArray = [];
    this.locationRangeFilters.statusArray = [];
    this.locationRangeFilters.teamTypesArray = [];
    this.locationRangeFilters.abilityArray = [];
    this.locationData.countryValue = '';
    this.locationData.stateValue = '';
    this.locationData.districtValue = '';
    this.filterChanges.emit(false);
  }
}
