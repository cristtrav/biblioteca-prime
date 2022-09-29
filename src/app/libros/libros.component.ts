import { Component, OnInit } from '@angular/core';
import { Libro } from '../interfaces/libro.interface';
import { LibrosService } from '../servicios/libros.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {

  //Aqui se guarda la lista de libros
  listaLibros: Libro[] = []; 
  //Esta variable muestra la animacion de carga
  cargando: boolean = false; 
  //Indica si el dialogo esta visible u oculto
  dialogoVisible: boolean = false; 

  constructor(
    private servicioLibros: LibrosService
  ) { }

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void{
    this.cargando = true;
    this.servicioLibros.get().subscribe({
      next: (datos) => {
        this.listaLibros = datos;
        this.cargando = false;
      },
      error: (e) => {
        console.log(e);
        this.cargando = false;
      }
    });
  }

  mostrarDialogo(){
    this.dialogoVisible = true;
  }
}
