import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { CustomRegex } from '../../const/validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm !: FormGroup;
  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(CustomRegex.email)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(CustomRegex.password)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.usersService.getUsers().subscribe(users => {
        // console.log(users);
        const user = users.find((u: any) => u.email === this.loginForm.value.email && u.password === this.loginForm.value.password);
        if (user) {
          this.router.navigate(['/home']);
          localStorage.setItem('isLoggedIn', JSON.stringify(true)); // Store true
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          alert('Invalid Credentials');
        }
      });
    }
  }

  get f() {
    return this.loginForm.controls
  }


}
