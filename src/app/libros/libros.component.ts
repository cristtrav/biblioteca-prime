import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { Libro } from '../interfaces/libro.interface';
import { LibrosService } from '../servicios/libros.service';
import { FormularioLibroComponent } from './formulario-libro/formulario-libro.component';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {

  @ViewChild('formulario') formLibro!: FormularioLibroComponent;

  //Aqui se guarda la lista de libros
  listaLibros: Libro[] = [];
  //Esta variable muestra la animacion de carga
  cargando: boolean = false;
  //Indica si el dialogo esta visible u oculto
  dialogoVisible: boolean = false;

  mensajes: Message[] = [];
  tituloDialogo: string = 'Registrar libro';

  constructor(
    private servicioLibros: LibrosService,
    private servicioConfirm: ConfirmationService
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
        const mensaje: string = e.status === 403 || e.status === 401 ? 'No autorizado' : e.message;
        this.mensajes = [{severity: 'error', summary: 'Error al cargar libros', detail: mensaje}]
      }
    });
  }

  nuevo(){
    this.tituloDialogo = 'Registrar libro';
    this.formLibro.limpiarFormulario();
    this.formLibro.modo = 'Registrar';
    this.formLibro.cargarAutores();
    this.dialogoVisible = true;
  }

  editar(libro: Libro){
    this.formLibro.idactual = Number(libro.id);
    this.formLibro.codigo = libro.id;
    this.formLibro.titulo = libro.titulo;
    this.formLibro.idautor = libro.idautor;
    this.formLibro.paginas = libro.paginas;
    this.formLibro.modo = 'Editar';
    this.formLibro.cargarAutores();
    this.dialogoVisible = true;
    this.tituloDialogo = "Editar libro";
  }

  eliminar(libro: Libro){
    this.servicioConfirm.confirm({
      message: "¿Realmente desea eliminar el libro: '"+libro.id+"-"+libro.titulo+'-'+libro.autor+"'?",
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-trash',
      accept: () => {
        this.servicioLibros.delete(libro).subscribe({
          next: ()=>{
            this.mensajes = [{severity: 'success', summary: 'Éxito', detail: 'Se eliminó correctamente el libro.'}];
            this.cargarLibros();
          },
          error: (e) => {
            console.log(e);
            const mensaje: string = e.status === 403 || e.status === 401 ? 'No autorizado' : e.message;
            this.mensajes=[{severity: 'error', summary: 'Error al eliminar', detail: mensaje}];
          }
        });
      }
    });
  }
}
