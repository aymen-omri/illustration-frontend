import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IllustrationService } from 'src/app/Utils/Services/Illustration.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-illustration-details',
  templateUrl: './illustration-details.component.html',
  styleUrls: ['./illustration-details.component.css']
})
export class IllustrationDetailsComponent implements OnInit {
  ngOnInit(): void {
    this.id_illus = Number(this.route.snapshot.paramMap.get('id'));
    this.findById();
    this.isLoggedIn = this.userService.isLoggedIn();

  }
  constructor(private illusService: IllustrationService, private route: ActivatedRoute, private userService: UserService) { }

  id_illus: number = 0;
  illus: any;
  category: string = "";
  isLoggedIn: boolean = false;

  findById() {
    this.illusService.getById(this.id_illus).subscribe((data: any) => {
      console.log(data);
      this.illus = data;
      this.category = this.illus.category;
    });
  }

  switchLanguage(event: any) {
    let lang = event.value;
    console.log(lang)
    if (!lang) {
      this.findById();
    } else {
      this.illus.addedIlustrtions.forEach((elem: any) => {
        if (elem.id_added == lang) {
          this.illus.name = elem.name;
          this.illus.user = elem.user;
          this.illus.description = elem.description;
          this.illus.date = elem.date;
          this.illus.illustrationUrl = elem.illustrationUrl;
          this.illus.language = elem.language;
          this.illus.category = elem.category;
        }
      });
    }
  }
}


