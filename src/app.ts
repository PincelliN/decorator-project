// Code goes here!
class ProjectInput {
  templateElement: HTMLTemplateElement;
  containerElement: HTMLDivElement;
  element: HTMLFormElement;
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.containerElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
    this.attach();
  }

  private attach() {
    this.containerElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const formProject = new ProjectInput();
