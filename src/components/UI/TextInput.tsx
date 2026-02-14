import {Box, Input as ChakraInput, type InputProps as ChakraInputProps} from '@chakra-ui/react';
import {Field} from '@chakra-ui/react';

type InputProps = ChakraInputProps & {
  label: string;
  errorText?: string;
  required?: boolean;
};

export const TextInput = ({label, errorText, required, ...rest}: InputProps) => (
  <Field.Root invalid={!!errorText}>
    <Field.Label color="text-secondary" fontSize="text.small">
      <Box as="span" color="text-danger" fontSize="text.base">
        *
      </Box>
      {label}
    </Field.Label>
    <ChakraInput
      {...rest}
      borderRadius="sm"
      px="4"
      py="3"
      fontSize="text.base"
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
);
