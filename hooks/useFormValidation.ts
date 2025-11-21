import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import type { ErrorMapCtx, ZodIssueOptionalMessage } from 'zod';
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

  // Create a custom error map that translates error messages
  const customErrorMap = (issue: ZodIssueOptionalMessage, ctx: ErrorMapCtx): { message: string } => {
    // If the error message is a translation key (starts with 'errors.' or 'auth.')
    if (typeof issue.message === 'string' && (issue.message.startsWith('errors.') || issue.message.startsWith('auth.'))) {
      return {
        message: t(issue.message),
      };
    }
    // Otherwise, return the default message
    return { message: ctx.defaultError };
  };

  return useForm<z.infer<T>>({
    resolver: zodResolver(schema, {
      errorMap: customErrorMap,
    } as any),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });
};
