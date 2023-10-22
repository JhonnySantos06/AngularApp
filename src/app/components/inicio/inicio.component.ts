import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataFirebaseService } from '../../service/data-firebase.service';
import { UserserviceService } from '../../service/userservice.service'; 
import { Task } from '../../task.model';

// en este momento funciona relativamente bien.... mejor version 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

 
  tasks: Task[] = []; // Lista de tareas
  taskForm: FormGroup ; // Formulario para agregar nuevas tareas

  constructor(private formBuilder: FormBuilder, private router:Router,private dataService: DataFirebaseService,
    private UserserviceService:UserserviceService) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    this.loadUserTasks();
  }

  goToLogin(){
    this.router.navigate(['login'])
  }
  // Método para cargar tareas del usuario
  loadUserTasks() {
    const userId = this.UserserviceService.getUserId(); // Obtener el userId del servicio
    if (userId) {
      this.dataService.getTasksForUser(userId).subscribe(
        (tasks) => {
          this.tasks = tasks || [];
        },
        (error) => {
          console.error('Error al cargar tareas:', error);
        }
      );
    } else {
      console.error('UserId no encontrado.');
    }
  }
  


// Método para agregar una nueva tarea
addTask() {
  if (this.taskForm.valid) {
    const newTask: Task = {
      title: this.taskForm.value.title,
      completed: false
    };

    const userId = this.UserserviceService.getUserId();
    if (userId) {
      this.dataService.saveTaskForUser(userId, newTask).subscribe(
        (taskId) => {
          if (taskId) {
            newTask.id = taskId; // Asigna el ID de la tarea
            this.tasks.push(newTask);
            this.taskForm.reset();
          } else {
            console.error('No se pudo obtener el ID de la tarea.');
          }
        },
        (error) => {
          console.error('Error al guardar la tarea:', error);
        }
      );
    } else {
      console.error('UserId no encontrado.');
    }
  }
}


  generateUniqueId(): string {
    // Lógica para generar un ID único
    return Date.now().toString();
  }
  
  toggleTaskCompletion(task: Task) {
    const userId = this.UserserviceService.getUserId();
    if (userId) {
      task.completed = !task.completed; // Cambia el estado de la tarea en el componente
      this.dataService.updateTask(userId, task).subscribe(
        () => {
          console.log('Estado de tarea actualizado con éxito.');
        },
        (error) => {
          console.error('Error al actualizar el estado de la tarea:', error);
          // En caso de error, deberías revertir el cambio en la tarea.
          task.completed = !task.completed;
        }
      );
    } else {
      console.error('UserId no encontrado.');
    }
  }
  
  
  
  


  deleteTask(task: Task) {
    const userId = this.UserserviceService.getUserId();
    console.log('EL user ID:', userId,task);
    if (userId) {
        this.dataService.deleteTaskForUser(userId, task).subscribe(
            () => {
                this.tasks = this.tasks.filter((t) => t !== task);
            },
            (error) => {
                console.error('Error al eliminar la tarea:', error);
            }
        );
    } else {
        console.error('UserId no encontrado.');
    }
}


}
