import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;
  signupUsers: any[] = [];
  loginError: string | null = null;

  constructor(private router: Router, private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, this.customNameValidator]],
      lastName: ['', [Validators.required, this.customNameValidator]],
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', [Validators.required, this.customPasswordValidator]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
    });

    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const localData = localStorage.getItem('signUpUsers');
    if (localData != null) {
      this.signupUsers = JSON.parse(localData);
    }
  }

  onSignUp() {
    if (this.signupForm.valid) {
      const userName = `${this.signupForm.value.firstName}${this.signupForm.value.lastName}`;
      const newUser = {
        ...this.signupForm.value,
        userName
      };
      this.signupUsers.push(newUser);
      localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));
      this.signupForm.reset();
    }
  }

  onLogIn(event: Event) {
    event.preventDefault();

    const isUserExist = this.signupUsers.find(m => m.userName == this.loginForm.value.userName && m.password == this.loginForm.value.password);
    if (isUserExist) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserName', this.loginForm.value.userName);
      this.router.navigate(['/anime']);
      this.loginError = null;
    } else {
      this.loginError = 'Wrong credentials';
    }
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserName');
    this.router.navigate(['/login']);
  }

  customNameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(control.value) ? null : { invalidName: true };
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }

  customPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }

  matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (this.signupForm) {
      return control.value === this.signupForm.get('password')?.value ? null : { passwordsMismatch: true };
    }
    return null;
  }
}
