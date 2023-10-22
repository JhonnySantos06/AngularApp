import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPersona } from '../persona'; 
import { Observable } from 'rxjs';
import { Task } from '../task.model';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DataFirebaseService {
  URL: string = 'https://gestiontareas-a519a-default-rtdb.firebaseio.com/'; // Reemplaza con la URL de tu base de datos Firebase

  constructor(private client: HttpClient) { }

  async savePersona(persona: IPersona): Promise<string | null> {
    const data = {
      name: persona.name,
      email: persona.email,
      password: persona.password
    };
  
    try {
      const response = await this.client.post<{ name: string }>(`${this.URL}personas.json`, data).toPromise();
  
      if (response && response.name) {
        // Registro exitoso, devuelve el ID
        return response.name;
      } else {
        // No se pudo obtener el ID, devuelve null
        return null;
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades.
    }
  }
  

  getUserByEmail(email: string): Observable<IPersona | null> {
    // Realiza una consulta a  base de datos Firebase para buscar el usuario por correo electrónico.
    return this.client.get<IPersona | null>(`${this.URL}personas.json?orderBy="email"&equalTo="${email}"`);
  }

    // Método para obtener las tareas asociadas a un correo electrónico
    getTasksForUser(userId: string): Observable<Task[]> {
      return this.client
        .get<{ [key: string]: Task | { [key: string]: any } }>(`${this.URL}personas/${userId}.json`)
        .pipe(
          map((response) => {
            if (response) {
              const tasks = Object.keys(response)
                .filter((key) => key !== 'email' && key !== 'name' && key !== 'password') // Filtra nodos innecesarios
                .map((key) => ({
                  id: key,
                  title: response[key].title,
                  completed: response[key].completed
                }));
    
              return tasks;
            } else {
              return [];
            }
          })
        );
    }
    
   

    // Método para guardar una nueva tarea asociada a un correo electrónico
   

      saveTaskForUser(userId: string, task: Task): Observable<string> {
        const data = {
          title: task.title,
          completed: task.completed
        };
      
        return this.client.post<{ name: string }>(`${this.URL}personas/${userId}.json`, data).pipe(
          map(response => response.name)
        );
      }
      
      
 

    deleteTaskForUser(userId: string, task: Task): Observable<void> {
      if (task && task.id) { // Verificar que task y task.id no sean undefined
        const taskId = task.id.toString();
        const deleteUrl = `${this.URL}personas/${userId}/${taskId}.json`;
        
        console.log('Enviando solicitud para eliminar:', deleteUrl);
    
        return this.client.delete<void>(deleteUrl);
      } else {
        console.error('La tarea o su ID no están definidos.');
        return throwError('La tarea o su ID no están definidos.'); // Puedes manejar el error de acuerdo a tus necesidades.
      }
    }

  getTaskIdByTitle(userId: string, title: string): Observable<any> {
    return this.client.get<any>(`${this.URL}personas/${userId}.json`).pipe(
      map((userResponse) => {
        if (userResponse && userResponse[userId]) {
          const userTasks = userResponse[userId];
          for (const taskId in userTasks) {
            if (userTasks[taskId].title === title) {
              // Encuentra la tarea con el título especificado y devuelve su ID
              return { [taskId]: true };
            }
          }
        }
        // Si no se encuentra la tarea, devolver un objeto vacío
        return {};
      })
    );
  }

  updateTask(userId: string, task: Task): Observable<void> {
    const data = {
      title: task.title,
      completed: task.completed
    };
  
    const taskId = task.id; // Obtenemos el ID de la tarea
    if (!taskId) {
      return throwError("La tarea no tiene un ID válido.");
    }
  
    const updateUrl = `${this.URL}personas/${userId}/${taskId}.json`;
  
    return this.client.put<void>(updateUrl, data);
  }
  
  


}
