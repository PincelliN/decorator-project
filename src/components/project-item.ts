///<reference path='base-component.ts'/>
///<reference path='../decorators/autobind.ts'/>
///<reference path='../models/project.ts'/>
///<reference path='../models/drag-drop.ts'/>
namespace App {
  //ProjectItem Class
  export class ProjectItem
    extends Component<HTMLUListElement, HTMLElement>
    implements Draggable
  {
    private project: Project;

    get person() {
      if (this.project.people === 1) {
        return "1 Persona assegnata ";
      } else {
        return `${this.project.people} Persone assegnate `;
      }
    }
    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false, project.id);
      this.project = project;
      this.configure();
      this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.id);
      event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(_: DragEvent): void {
      console.log("DragEnd");
    }

    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.templateElement.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent = this.person;
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }
}
