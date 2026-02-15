import {forwardRef} from 'react';
import {
  Field,
  Box,
  Textarea as ChakraTextarea,
  type TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react';

type TextareaInputProps = ChakraTextareaProps & {
  label: string;
  errorText?: string;
  required?: boolean;
};

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({label, errorText, required, ...rest}, ref) => (
    <Field.Root invalid={!!errorText}>
      <Field.Label color="text-secondary" fontSize="text.small">
        {required && (
          <Box as="span" color="text-danger" fontSize="text.base">
            *
          </Box>
        )}
        {label}
      </Field.Label>
      <ChakraTextarea
        ref={ref}
        {...rest}
        borderRadius="sm"
        px="4"
        py="3"
        fontSize="text.base"
        minH="120px"
        _hover={{borderColor: 'border-brand'}}
        _focusVisible={{borderColor: 'border-brand', boxShadow: '0 0 0 4px rgba(15, 98, 254, 0.2)'}}
        _invalid={{
          borderColor: 'text-danger',
          _hover: {borderColor: 'text-danger'},
          _focusVisible: {boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.2)'},
        }}
      />
      {errorText && (
        <Field.ErrorText color="text-danger" fontSize="text.small">
          {errorText}
        </Field.ErrorText>
      )}
    </Field.Root>
  )
);
