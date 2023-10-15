import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


interface Task {
  id: number;
  title: string;
  completed: boolean;
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

 
  tasks: Task[] = []; // Lista de tareas
  taskForm: FormGroup ; // Formulario para agregar nuevas tareas

  constructor(private formBuilder: FormBuilder, private router:Router) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializa el formulario con validadores
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  goToLogin(){
    this.router.navigate(['login'])
  }

  // Agregar una nueva tarea
  addTask() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: this.tasks.length + 1, // Genera un ID único
        title: this.taskForm.value.title,
        completed: false
      };
      this.tasks.push(newTask);
      this.taskForm.reset();
    }
  }

  // Marcar una tarea como completada
  markAsCompleted(task: Task) {
    task.completed = true;
  }

  // Eliminar una tarea
  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

}
