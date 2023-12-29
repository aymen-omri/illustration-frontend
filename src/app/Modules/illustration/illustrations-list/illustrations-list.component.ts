import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IllustrationService } from 'src/app/Utils/Services/Illustration.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-illustrations-list',
  templateUrl: './illustrations-list.component.html',
  styleUrls: ['./illustrations-list.component.css']
})
export class IllustrationsListComponent implements OnInit {
  ngOnInit(): void {
    this.getAllIllustrations();
    this.role = this.userService.decodeJwtToken().payload.scope;
  }

  constructor(private illusService: IllustrationService, private userService: UserService) { }

  illustrations: any[] = [];
  categories: string[] = [
    "Biology",
    "Geology",
    "Mechanics",
    "Electrical",
    "Computer_Science",
    "Physics",
    "Chemistry"];
  languages: string[] = [
    "ENGLISH",
    "FRENCH",
    "SPANISH",
    "GERMAN",
    "ITALIAN",
    "PORTUGUESE",
    "DUTCH",
    "RUSSIAN",
    "CHINESE",
    "JAPANESE",
    "ARABIC",
    "HINDI",
    "BENGALI",
    "URDU",
    "PERSIAN",
    "TURKISH",
    "KOREAN"
  ];

  name = new FormControl('');
  category = new FormControl('');
  language = new FormControl('');
  filter: any[] = [];
  role: string = "";

  getAllIllustrations() {
    this.illusService.getAll().subscribe((data: any) => {
      this.illustrations = this.filter = data;
    });
  }

  filterIllus() {
    this.filter = this.illustrations.filter((elem: any) => {
      let catMatch = true;
      let langMatch = true;
      let nameMatch = true;
      if (this.category.value) {
        catMatch = this.category.value == elem.category;
      }
      if (this.language.value) {
        langMatch = this.language.value == elem.language;
      }
      if (this.name.value) {
        nameMatch = elem.name.toLowerCase().includes(this.name.value.toLowerCase());
      }
      return catMatch && langMatch && nameMatch;
    });
  }

  clearFilter() {
    this.category.reset();
    this.name.reset();
    this.language.reset();
    this.filter = this.illustrations;
  }

  deleteIllus(id: number) {
    this.illusService.deleteIllus(id).subscribe({
      next: () => {
        this.getAllIllustrations();
      }
    })
  }

}
