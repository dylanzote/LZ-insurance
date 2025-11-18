import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from './useTranslation';

interface UseFormValidationProps<T extends z.ZodType<any, any>> {
  schema: T;
  defaultValues?: z.infer<T>;
}

export const useFormValidation = <T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
}: UseFormValidationProps<T>): UseFormReturn<z.infer<T>> => {
  const { t } = useTranslation();

  return useForm<z.infer<T>>({
    resolver: zodResolver(schema, {
      errorMap: (issue, ctx) => {
        // If the error message is a translation key (starts with 'errors.' or 'auth.')
        if (typeof issue.message === 'string' && (issue.message.startsWith('errors.') || issue.message.startsWith('auth.'))) {
          return {
            message: t(issue.message),
          };
        }
        // Otherwise, return the default message
        return { message: ctx.defaultError };
      },
    }),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });
};
