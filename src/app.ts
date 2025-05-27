///<reference path='drag-drop-interface.ts'/>
///<reference path='project-model.ts'/>
///<reference path='project-state.ts'/>
///<reference path='validation.ts'/>
namespace App {
  // Autobind decorator
  function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethods = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = originalMethods.bind(this);
        return boundFn;
      },
    };
    return adjDescriptor;
  }

  //Component Base Class
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }
      this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtStart ? "afterbegin" : "beforeend",
        this.element
      );
    }
    abstract configure(): void;

    abstract renderContent(): void;
  }

  //ProjectItem Class
  class ProjectItem
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

  //ProjectList

  class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);

      this.assignedProjects = [];
      this.configure();
      this.renderContent();
    }
    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }
    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
        const relevantProject = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProject;
        this.renderProjects();
      });
    }
    renderContent() {
      const listId = `${this.type}-project-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type === "active" ? "PROGETTI ATTIVI" : "PROGETTI FINITI";
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-project-list`
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }
  }

  //ProjectInput
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");
      this.titleInput = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInput = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInput = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() {}

    private gatherUserInput(): [string, string, number] | void {
      const enterTitle = this.titleInput.value;
      const enterDescription = this.descriptionInput.value;
      const enterPeople = this.peopleInput.value;

      const validateTitle: Validation = {
        value: enterTitle,
        required: true,
      };
      const validateDescription: Validation = {
        value: enterDescription,
        required: true,
        minLength: 5,
      };
      const validatePeople: Validation = {
        value: +enterPeople,
        required: true,
        min: 1,
      };

      if (
        !validate(validateTitle) ||
        !validate(validateDescription) ||
        !validate(validatePeople)
      ) {
        alert("Invalid Input, please try again!");
        return;
      } else {
        return [enterTitle, enterDescription, +enterPeople];
      }
    }

    private clearInputs() {
      this.titleInput.value = "";
      this.descriptionInput.value = "";
      this.peopleInput.value = "";
    }

    @autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }
  }

  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
