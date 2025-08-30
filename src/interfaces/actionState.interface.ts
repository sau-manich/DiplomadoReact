export interface ActionState<T> {
    errors: Partial<Record<keyof T, string>>;
    message: string;
    formData?: Partial<T>;
  }