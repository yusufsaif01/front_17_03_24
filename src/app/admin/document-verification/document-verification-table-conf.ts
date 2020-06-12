import { TableConfig } from '@app/shared/table/TableConfig';

export class DocumentVerificationTableConfig extends TableConfig {
  text: string = 'Document Number';
  constructor(member_type: string) {
    super();
    console.log('Type of member', member_type);
    if (member_type === 'player') {
      this.allowedColumns = [
        'serialNumber',
        'player_name',
        'date_of_birth',
        'added_on',
        'document_number',
        'aadhaarimg',
        'user_photo',
        'status'
      ];
      this.text = 'Aadhar No.';
    } else if (member_type === 'club') {
      this.allowedColumns = [
        'serialNumber',
        'name',
        'added_on',
        'document_number',
        'document_image',
        'status'
      ];
    } else if (member_type === 'academy') {
      this.allowedColumns = [
        'serialNumber',
        'name',
        'added_on',
        'document_type',
        'document_number',
        'document_image',
        'status'
      ];
    }

    this.columns = {
      serialNumber: {
        code: 'serialNumber',
        text: 'S No.',
        getValue: (ele: any) => {
          return ele[this.columns.serialNumber.code];
        }
      },
      name: {
        code: 'name',
        text: member_type === 'club' ? 'Club Name' : 'Academy Name',
        getValue: (ele: any) => {
          return ele[this.columns.name.code];
        }
      },
      player_name: {
        code: 'player_name',
        text: 'Player Name',
        getValue: (ele: any) => {
          return ele[this.columns.player_name.code];
        }
      },
      date_of_birth: {
        code: 'date_of_birth',
        text: 'DOB',
        getValue: (ele: any) => {
          return ele[this.columns.date_of_birth.code];
        }
      },
      added_on: {
        code: 'added_on',
        text: 'Added On',
        getValue: (ele: any) => {
          return ele[this.columns.added_on.code];
        }
      },
      document_type: {
        code: 'document_type',
        text: 'Document Type',
        getValue: (ele: any) => {
          return ele[this.columns.document_type.code];
        }
      },
      document_number: {
        code: 'document_number',
        text: this.text,
        getValue: (ele: any) => {
          return ele[this.columns.document_number.code];
        }
      },
      document_image: {
        code: 'document_image',
        text: 'Document Image',
        getValue: (ele: any) => {
          return ele[this.columns.document_image.code];
        }
      },
      aadhaarimg: {
        code: 'aadhaarimg',
        text: 'Aadhaar Image',
        getValue: (ele: any) => {
          return ele[this.columns.aadhaarimg.code];
        }
      },
      user_photo: {
        code: 'user_photo',
        text: 'Player Image',
        getValue: (ele: any) => {
          return ele[this.columns.user_photo.code];
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
