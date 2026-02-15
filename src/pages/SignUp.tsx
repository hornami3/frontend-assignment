import {Box, Button, Flex, Heading, Text} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {object, ref, string} from 'yup';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router';
import {RiArrowRightLine} from 'react-icons/ri';
import {TextInput} from '../components/UI/TextInput';
import {PasswordInput} from '../components/UI/PasswordInput';
import {Link} from '../components/UI/Link';
import {toaster} from '../components/UI/Toaster';
import {useRegisterMutation} from '../store/api/authApi';

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterMutation();

  const schema = object({
    username: string().required(t('validation.required', {field: t('signUp.username')})),
    password: string()
      .required(t('validation.required', {field: t('signUp.password')}))
      .min(6, t('validation.minLength', {field: t('signUp.password'), min: 6})),
    confirmPassword: string()
      .required(t('validation.required', {field: t('signUp.confirmPassword')}))
      .oneOf([ref('password')], t('validation.passwordMatch')),
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await registerUser({
        username: data.username,
        password: data.password,
      }).unwrap();
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      navigate('/overview');
    } catch {
      toaster.create({title: t('error.generic'), type: 'error'});
    }
  });

  return (
    <Flex minH="100vh" align="center" justify="center" direction="column" gap="6" px="4">
      <Box bg="fill-white" borderRadius="2xl" p="6" w="full" maxW="500px" sm={{p: 10}}>
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="6">
            <Heading fontSize="heading.2" fontWeight="heading.1" color="text-primary">
              {t('signUp.title')}
            </Heading>

            <Text fontSize="text.base" color="text-secondary" lineHeight="normal">
              {t('signUp.description')}
            </Text>

            <TextInput
              required
              label={t('signUp.username')}
              errorText={errors.username?.message}
              {...register('username')}
            />

            <PasswordInput
              required
              label={t('signUp.password')}
              errorText={errors.password?.message}
              {...register('password')}
            />

            <PasswordInput
              required
              label={t('signUp.confirmPassword')}
              errorText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" w="full" size="lg" mt="2" variant="primary" loading={isLoading}>
              {t('signUp.submit')} <RiArrowRightLine />
            </Button>
          </Flex>
        </form>
      </Box>

      <Text fontSize="text.base" color="text-secondary">
        {t('signUp.hasAccount')} <Link href="/sign-in">{t('signUp.signInLink')}</Link>
      </Text>
    </Flex>
  );
};
