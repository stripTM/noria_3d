import { NoriaApp } from './app/NoriaApp.js';

const app = new NoriaApp('app-container');

// Hacer la aplicación disponible globalmente para debugging
(window as any).noriaApp = app;
