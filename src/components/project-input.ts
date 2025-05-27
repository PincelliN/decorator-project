///<reference path='base-component.ts'/>
///<reference path='../util/validation.ts'/>
///<reference path='../decorators/autobind.ts'/>
///<reference path='../state/project-state.ts'/>
namespace App {
  //ProjectInput
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}
