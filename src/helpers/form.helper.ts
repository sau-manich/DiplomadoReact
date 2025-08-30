import z from 'zod';
import type { ActionState } from '../interfaces';
import { errorHelper } from './error.helper';

export const createInitialState = <T>(): ActionState<T> => {
  return {
    errors: {},
    message: '',
  };
};

export const hanleZodError = <T>(error: unknown, rawData: Partial<T>): ActionState<T> => {
  if (error instanceof z.ZodError) {
    const fieldErros: Partial<Record<keyof T, string>> = {};
    error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof T;
      fieldErros[field] = issue.message;
    });
    return {
      errors: fieldErros,
      message: 'Por favor corrige los errores en el formulaario',
      formData: rawData,
    };
  }

  return {
    errors: {},
    message: errorHelper(error),
    formData: rawData,
  };
};
