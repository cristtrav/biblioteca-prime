import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SesionService} from './../servicios/sesion.service';
import { Credenciales } from './../interfaces/credenciales.interface';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    ci: new FormControl<number | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });
  public mensajes: Message[] = [];

  constructor(
    private servicioSesion: SesionService
  ) { }

  ngOnInit(): void {
  }

  public iniciarSesion(){
    this.actualizarValidacion();
    if(this.form.valid){
      const cred: Credenciales = {
        ci: this.form.get('ci')?.value,
        password: this.form.get('password')?.value
      }
      this.servicioSesion.iniciar(cred).subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          this.mensajes = [{severity: 'success', summary: 'Inicio de sesión correcto'}];
        },
        error: (e) => {
          console.error('Error al iniciar sesion', e);
          if(e.status === 401){
            this.mensajes = [{severity: 'error', summary: 'CI o Contraseña incorrecta'}]
          }else{
              this.mensajes = [{severity: 'error', summary: 'Error al iniciar sesion', detail: e.message}];
          }
        }
      });
    }
    console.log(this.form.get('ci')?.value);
    console.log(this.form.get('password')?.value);
  }

  private actualizarValidacion(){
    if(this.form.get('ci')?.invalid){
      this.form.get('ci')?.markAsTouched();
      this.form.get('ci')?.markAsDirty();
    }
    if(this.form.get('password')?.invalid){
      this.form.get('password')?.markAsTouched();
      this.form.get('password')?.markAsDirty();
    }
  }

}
