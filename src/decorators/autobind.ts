namespace App {
  // Autobind decorator
  export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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
}
