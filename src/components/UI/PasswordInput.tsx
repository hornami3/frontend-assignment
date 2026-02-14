import {useRef} from 'react';
import type {ReactNode, Ref} from 'react';
import type {ButtonProps, GroupProps, InputProps as ChakraInputProps} from '@chakra-ui/react';
import {
  Box,
  Field,
  IconButton,
  Input,
  InputGroup,
  mergeRefs,
  useControllableState,
} from '@chakra-ui/react';
import {LuEye, LuEyeOff} from 'react-icons/lu';

interface PasswordVisibilityProps {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: {on: ReactNode; off: ReactNode};
}

type PasswordInputProps = ChakraInputProps &
  PasswordVisibilityProps & {
    label: string;
    errorText?: string;
    ref?: Ref<HTMLInputElement>;
    rootProps?: GroupProps;
  };

export const PasswordInput = ({
  label,
  errorText,
  ref,
  rootProps,
  defaultVisible,
  visible: visibleProp,
  onVisibleChange,
  visibilityIcon = {on: <LuEye />, off: <LuEyeOff />},
  ...rest
}: PasswordInputProps) => {
  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible || false,
    onChange: onVisibleChange,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field.Root invalid={!!errorText}>
      <Field.Label color="text-secondary" fontSize="text.small">
        <Box as="span" color="text-danger" fontSize="text.base">
          *
        </Box>
        {label}
      </Field.Label>
      <InputGroup
        endElement={
          <VisibilityTrigger
            disabled={rest.disabled}
            onPointerDown={(e) => {
              if (rest.disabled) return;
              if (e.button !== 0) return;
              e.preventDefault();
              setVisible(!visible);
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        }
        {...rootProps}
      >
        <Input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type={visible ? 'text' : 'password'}
          borderRadius="sm"
          px="4"
          py="3"
          fontSize="text.base"
          _hover={{borderColor: 'border-brand'}}
          _focusVisible={{
            borderColor: 'border-brand',
            boxShadow: '0 0 0 4px rgba(15, 98, 254, 0.2)',
          }}
          _invalid={{
            borderColor: 'text-danger',
            _hover: {borderColor: 'text-danger'},
            _focusVisible: {boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.2)'},
          }}
        />
      </InputGroup>
      {errorText && (
        <Field.ErrorText color="text-danger" fontSize="text.small">
          {errorText}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

const VisibilityTrigger = ({ref, ...props}: ButtonProps & {ref?: Ref<HTMLButtonElement>}) => (
  <IconButton
    tabIndex={-1}
    ref={ref}
    aspectRatio="square"
    size="xs"
    variant="plain"
    bg="none"
    _hover={{bg: 'fill-gray-lightest'}}
    _active={{bg: 'fill-gray-lightest'}}
    height="calc(100% - {spacing.2})"
    aria-label="Toggle password visibility"
    {...props}
  />
);
