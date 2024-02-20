import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, finalize } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hidePassword = true;
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  apiError = '';
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  loginForm = new FormGroup({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  onSubmit(): void {
    this.loading.next(true);
    this.authService
      .login(
        this.loginForm.value.username as string,
        this.loginForm.value.password as string
      )
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('token', res.token);
          this.router.navigate(['']);
        },
        error: ({ error }) => {
          console.log(error);
          this.apiError = error.message;
        },
      });
  }
}
