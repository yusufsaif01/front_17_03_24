import { TableConfig } from '@app/shared/table/TableConfig';
import { CapitalizePipe } from '@app/shared/pipes/capitalize.pipe';

export class ManageClubTableConfig extends TableConfig {
  constructor(private capitalize?: CapitalizePipe) {
    super();
    this.allowedColumns = ['name', 'no_of_footplayers', 'email', 'status'];
    this.capitalize = new CapitalizePipe();

    this.columns = {
      name: {
        code: 'name',
        text: 'Club Name',
        getValue: (ele: any) => {
          return this.capitalize.transform(ele[this.columns.name.code]);
        }
      },
      no_of_footplayers: {
        code: 'no_of_footplayers',
        text: 'No. of FooTPlayers',
        getValue: (ele: any) => {
          return ele[this.columns.no_of_footplayers.code];
        }
      },
      email: {
        code: 'email',
        text: 'E-Mail ID',
        getValue: (ele: any) => {
          return ele[this.columns.email.code];
        }
      },
      status: {
        code: 'status',
        text: 'Status',
        getValue: (ele: any) => {
          return ele[this.columns.status.code];
        }
      },
      action: {
        code: 'action',
        text: 'Action',
        getValue: (ele: any) => {
          return ele[this.columns.action.code];
        }
      }
    };
  }
}
