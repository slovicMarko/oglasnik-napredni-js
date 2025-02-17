import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
          ],
        ],
        repeatPassword: ['', Validators.required],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }

  createUser() {
    if (this.registerForm.invalid) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const { password, repeatPassword, ...user } = this.registerForm.value;
    this.authService.register({ ...user, password }).subscribe({
      next: () => {
        alert('User registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during registration:', err);
        alert('An error occurred while registering the user.');
      },
    });
  }
}
