import { Component, OnInit } from "@angular/core";
import { ProjectService } from "src/app/services/Project.service";
import { AuthenServiceService } from "src/app/services/AuthenService.service";
import { ContactService } from "src/app/services/Contact.service";
import {
  IContactModel,
  Icontact,
  UpdateIcontact,
  CreateIcontact
} from "src/app/interfaces/IContactModel";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NavigationEnd } from '@angular/router';
import { IHistoryForContactModel, IHistoryCallSearchModel } from 'src/app/interfaces/IHistoryCallModel';

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"]
})
// export class ExpansionOverviewExample {
//   panelOpenState = false;
// }
export class ContactComponent implements OnInit {
  uid: string;
  code: string;
  list: IContactModel[];
  count = 1;
  m: Icontact;
  listHistory: IHistoryForContactModel[];
  d: IHistoryCallSearchModel;
  editContact: UpdateIcontact = {
    Id: undefined,
    FullName: undefined,
    Phone: undefined,
    Email: undefined
  };
  IdUser: number;
  createCont: CreateIcontact = {
    UID: undefined,
    Phone: undefined,
    FullName: undefined,
    Email: undefined,
    Type: undefined,
    ProjectCode: undefined,
    IdUser: undefined
  }
  searchStr = "";

  constructor(
    private modalService: NgbModal,
    private contactService: ContactService,
    private projectService: ProjectService,
    private authenService: AuthenServiceService
  ) {
    this.code = this.projectService.GetCookie().Code;
    this.uid = this.authenService.GetUserInfo().UID;
    this.IdUser = this.authenService.GetUserInfo().Id;
  }

  ngOnInit() {
    this.contactService.getAllSX(this.uid, this.code).subscribe(data => {
      this.list = data.data;
    });

    this.contactService.getAllHistory(this.uid, this.code).subscribe(data => {
      this.listHistory = data.data;
    });
  }

  onClick(model: Icontact) {
    this.m = model;
    this.editContact.Id = this.m.Id;
    this.editContact.FullName = this.m.FullName;
    this.editContact.Email = this.m.Email;
    this.editContact.Phone = this.m.Phone;
  }

  onSearch() {
    if (this.searchStr.length > 0) {
      console.log("onSearch start! count: " + this.count);
      this.count++;
      for (let item of this.list) {
        item.models = item.models.filter(res => {
          return (
            res.FullName != null &&
            res.FullName != "" &&
            res.Phone != null &&
            res.Phone.toString() != "" &&
            (res.FullName.toLocaleUpperCase().match(
              this.searchStr.toLocaleUpperCase()
            ) ||
              res.Phone.toString().match(this.searchStr))
          );
        });
      }
      console.log("onSearch done!");
    } else {
      this.ngOnInit();
    }
  }

  openTemplate(content: any) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    console.log(this.list);
  }

  closeEditContact() {
    // khôi phục lại dữ liệu hiển thị khi người dùng bấm 'X' cửa số Edit
    console.log("closeEditContact start!");
    this.editContact.FullName = this.m.FullName;
    this.editContact.Email = this.m.Email;
    this.editContact.Phone = this.m.Phone;
    console.log("closeEditContact doane!");
  }

  closeCreateContact() {
    // khôi phục lại dữ liệu hiển thị khi người dùng bấm 'X' cửa số Edit
    console.log("closeCreateContact start!");
    this.createCont.FullName = "";
    this.createCont.Email = "";
    this.createCont.Phone = "";
    console.log("closeCreateContact doane!");
  }

  updateContact() {
    console.log("updateContact start!");
    console.log(this.editContact);
    // this.contactService.checkExistMail(this.uid,this.editContact.Email).subscribe(data => {
    //   console.log(data)
    // });

    // this.contactService.checkExistPhone(this.uid,this.editContact.Phone).subscribe(data => {
    //   console.log(data)
    // });

    this.contactService.UpdateContact(this.editContact).subscribe(data => {
      console.log(data);
      if (data.data == true) {
        window.location.reload();
      }
      console.log(data.message);
      console.log(data.message);
    });
    console.log("updateContact done!");

  }

  createContact() {
    console.log("createContact start!");
    this.createCont.IdUser = this.IdUser;
    this.createCont.Type = 2;
    this.createCont.UID = this.uid;
    this.createCont.ProjectCode = this.code;
    console.log(this.createCont);
    this.contactService.createContact(this.createCont).subscribe(data => {
      console.log(data);
      if (data.status == 1) {
        window.location.reload();
      }
    });
    console.log("createContact done!");
  }

  deleteContact() {
    this.contactService.deleteContact(this.m.Id).subscribe(data => {
      console.log(data);
      if (data.status == 1) {
        window.location.reload();
      }
    });
  }
}
