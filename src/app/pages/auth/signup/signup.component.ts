import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  hidePassword = true;
  loading = new BehaviorSubject<boolean>(false);
  apiError = '';

  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  confirmPasswordControl = new FormControl('', [Validators.required]);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  signupForm = new FormGroup(
    {
      username: this.usernameControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
    },
    this.validateForm
  );

  validateForm(control: AbstractControl): ValidationErrors | null {
    if (control.value.confirmPassword === control.value.password) {
      return null;
    } else {
      return { PasswordNoMatch: true };
    }
  }

  onSubmit(): void {
    this.loading.next(true);
    this.authService
      .signup(
        this.signupForm.value.username as string,
        this.signupForm.value.password as string
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
        error: ({error}) => {
          console.log(error);
          this.apiError = error.message;
        },
      });
  }
}
