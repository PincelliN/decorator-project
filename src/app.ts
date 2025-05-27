///<reference path='components/project-list.ts'/>
///<reference path='components/project-input.ts'/>

/*
Nelle versioni più moderne di TypeScript (o JavaScript con moduli), i componenti o le funzioni vengono importati tramite:
import { nomeFunzione } from 'percorso-del-modulo';

Questo sostituisce l'uso delle triple slash directive (/// <reference />), che era comune nei progetti precedenti.
*/
namespace App {
  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
