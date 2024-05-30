import { Component, OnInit } from '@angular/core'
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { AuthService } from 'src/app/services/auth-service.service'
import { SubjectPayload } from 'src/app/utils_/payloads/Auth/subjects.payload'

@Component({
  selector: 'app-multi-dropdown-subject',
  templateUrl: './multi-dropdown-subject.component.html',
  styleUrls: ['./multi-dropdown-subject.component.css'],
})
export class MultiDropdownSubjectComponent implements OnInit {
  //drop down select or subject
  dropdownList: any[] = []
  selectedItems: any[] = []
  dropdownSettings: IDropdownSettings = {}

  constructor(private authService: AuthService) {}
  ngOnInit() {
    let tmp: any[] = []
    // this.authService.getAllSubjects().subscribe(
    //   (subjects: Array<SubjectPayload>) => {
    //     for (let i = 0; i < subjects.length; i++) {
    //       tmp.push({ id: subjects[i].id, name: subjects[i].name })
    //     }
    //     this.dropdownList = tmp
    //   },
    //   (err: any) => {
    //     console.log('Error Response: ' + err)
    //   },
    // )
    this.selectedItems = []
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    }
  }

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
}
