import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AddEditEmployementContractComponent } from './add-edit-employement-contract/add-edit-employement-contract.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ViewProfileComponent,
    EditProfileComponent,
    AddEditEmployementContractComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule {}
