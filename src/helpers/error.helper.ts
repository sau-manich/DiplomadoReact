import type { AxiosError } from 'axios';

export const errorHelper = (error: unknown) => {
  let message =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response?.data.message ??
    (error as AxiosError).message ??
    'Error inesperado';

  message =
    (error as AxiosError).status === 401
      ? 'Debe loguearse nuevamente'
      : message;

  return message
};
