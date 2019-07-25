import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../User';
import { Company } from '../company';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  isAllRowSelected = false;
  company: Company;
  users: User[] = [];
  companyArray: Company[] = [];
  favCompanies: Company[] = [];
  loginUser: string;
  loginToken: string;
  selection: any;

  displayedColumns: string[] = ['select', 'Name', 'Address', 'PhoneNumber'];
  dataSource = new MatTableDataSource(this.companyArray);

  constructor(private router: Router, private auth: AuthService, private services: ApplicationService) {
    this.selection = new SelectionModel<Company>(true, []);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {

    this.companyForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'phoneNumber': new FormControl(null, Validators.required)
    });

    document.getElementById("showAllBtn").hidden = true;
    document.getElementById("markUnmarkFavBtn").hidden = false;
    document.getElementById("showFavBtn").hidden = false;

    this.loginToken = localStorage.getItem("loginToken").toString();
    this.loginUser = localStorage.getItem("loginUser").toString();
    this.getAllCompanies();
    this.dataSource.sort = this.sort;
  }

  /* Checks whether the data entered in company form is valid */
  validateCompany(): boolean {
    this.company.name = this.company.name.trim();
    this.company.address = this.company.address.trim();
    var mobileRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    if (this.company.name === undefined || this.company.name === "") {
      alert("Enter Company Name");
      return false;
    }
    else if (this.company.address === undefined || this.company.address === "") {
      alert("Enter Company Address");
      return false;
    }
    else if (this.company.phoneNumber === undefined || this.company.phoneNumber === "" || !(this.company.phoneNumber.match(mobileRegExp))) {
      alert("Enter Valid Company Phone");
      return false;
    }
    else {
      return true;
    }
  }

  /* Checks whether the entered company is already registered or not */
  checkValidCompany(companyArray: any) {
    if (!(typeof companyArray.find((d => d.Name.toLocaleLowerCase() === this.company.name.toLocaleLowerCase())) === "object")) {
      this.services.addCompany(this.company, this.loginToken).subscribe(
        data => {
          if (data.IsSuccess) {
            alert("Company Added Succesfully");
            this.companyForm.reset();
            this.getAllCompanies();
          }
          else {
            alert(data.Message);
            this.companyForm.reset();
          }
        }
      );
    }
    else {
      alert("Company Already Registered.");
      this.companyForm.reset();
    }
  }

  /* Registers a new company in database */
  addCompany(): void {
    this.company = this.companyForm.value;
    let isValid: boolean = this.validateCompany();
    if (isValid) {
      this.services.getAllCompanies(this.loginToken).subscribe(
        data => {
          this.companyArray = data.ReturnValue;
          this.checkValidCompany(this.companyArray);
        });
    }
  }

  /* Fetches all registered companies from database */
  getAllCompanies(): void {
    this.services.getAllCompanies(this.loginToken).subscribe(
      data => {
        this.companyArray = data.ReturnValue;

        this.displayedColumns = ['select', 'Name', 'Address', 'PhoneNumber'];
        this.isAllRowSelected = (this.companyArray.find(x => x.isFavourite == false) == undefined) ? true: false;
        this.dataSource = new MatTableDataSource(this.companyArray);
        this.dataSource.sort = this.sort;

        document.getElementById("showAllBtn").hidden = true;
        document.getElementById("markUnmarkFavBtn").hidden = false;
        document.getElementById("showFavBtn").hidden = false;
      });
  }

  /* Fetches the user's favourite companies from database */
  getFavCompanies(): void {
    this.services.getFavCompanies(this.loginUser, this.loginToken).subscribe(
      data => {
        this.companyArray = data.ReturnValue;

        this.displayedColumns = ['Name', 'Address', 'PhoneNumber'];
        this.isAllRowSelected = (this.companyArray.find(x => x.isFavourite == false) == null)? true : false;
        this.dataSource = new MatTableDataSource(this.companyArray);
        this.dataSource.sort = this.sort;

        document.getElementById("showAllBtn").hidden = false;
        document.getElementById("markUnmarkFavBtn").hidden = true;
        document.getElementById("showFavBtn").hidden = true;
      });
  }

  /* Applies filter on the company table based on the entered value */
  applyFilter(filterValue: string) {
    if (filterValue != null)
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.selection.selected != null && this.dataSource.data != null) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    else return false;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  toggleSelectAll() {
    this.isAllRowSelected = !this.isAllRowSelected;
    for (var count = 0; count < this.companyArray.length; count++) {
      let rowItem = this.companyArray[count];
      rowItem["isFavourite"] = this.isAllRowSelected;
    }
  }

   /* The selected value for the checkbox on the passed row */
  toggleRowSelection(row: Company) {
    for (var count = 0; count < this.companyArray.length; count++) {
      let rowItem = this.companyArray[count];
      if (rowItem["_id"] == row["_id"]) {
        row["isFavourite"] = !row["isFavourite"];
        break;
      }
    }
  }

  /* Saves the user's favourite company list to database */
  markUnmarkFavourite() {
    this.services.markUnmarkFavCompany(this.loginUser, this.companyArray, this.loginToken).subscribe(
      data => {
        alert("Companies Marked/Unmarked As Favourites");
        this.companyForm.reset();
        this.getAllCompanies();
      });
  }

  /* Clears the stored token and logs out user session */
  logout() {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("loginUser");
    alert("Logged Out Succesfully");
    this.router.navigateByUrl("/login");
  }
}

