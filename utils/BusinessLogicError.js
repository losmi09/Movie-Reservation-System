export class BusinessLogicError {
  constructor(field, message) {
    this.name = 'BusinessLogicError';
    this.details = [];
    if (field && message) this.pushError(field, message);
  }

  pushError(field, message) {
    this.details.push({ path: field, message });
  }

  throwIfNotEmpty() {
    if (this.details.length > 0) throw this;
  }
}
