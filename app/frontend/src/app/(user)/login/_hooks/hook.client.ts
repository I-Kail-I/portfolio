import { useMutation } from '@tanstack/react-query';
import { login } from './hook';

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
  });
}
