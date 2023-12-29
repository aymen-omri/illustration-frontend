import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  ngOnInit(): void {
    this.getUsers();
  }
  constructor(private userService: UserService) { }
  users: any[] = [];
  displayedColumns: string[] = ['fullname', 'username', 'email', 'birthdate', 'actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getUsers() {
    this.userService.getAll().subscribe((data: any) => {
      console.log(data);
      this.users = data;
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.username.toLowerCase().includes(filter.trim().toLowerCase());
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableDisable(id: number) {
    this.userService.enableDisable(id).subscribe({
      next: () => {
        this.getUsers();
      }
    });
  }

}
