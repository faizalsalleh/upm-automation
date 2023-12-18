import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  constructor() { }

  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = () => resolve(); // Wrap resolve in an arrow function
      scriptElement.onerror = (error) => reject(error); // Handle script load error
      document.body.appendChild(scriptElement);
    });
  }
}
