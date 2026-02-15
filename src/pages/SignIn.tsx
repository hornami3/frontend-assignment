import {Box, Button, Flex, Heading, Text} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {object, string} from 'yup';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router';
import {RiArrowRightLine} from 'react-icons/ri';
import {TextInput} from '../components/UI/TextInput';
import {PasswordInput} from '../components/UI/PasswordInput';
import {Link} from '../components/UI/Link';
import {toaster} from '../components/UI/Toaster';
import {useLoginMutation} from '../store/api/authApi';

interface FormValues {
  username: string;
  password: string;
}

export const SignIn = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [login, {isLoading}] = useLoginMutation();

  const schema = object({
    username: string().required(t('validation.required', {field: t('signIn.username')})),
    password: string()
      .required(t('validation.required', {field: t('signIn.password')}))
      .min(6, t('validation.minLength', {field: t('signIn.password'), min: 6})),
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
      const result = await login(data).unwrap();
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      navigate('/overview');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'status' in err && err.status === 401
          ? t('error.invalidCredentials')
          : t('error.generic');
      toaster.create({title: message, type: 'error'});
    }
  });

  return (
    <Flex minH="100vh" align="center" justify="center" direction="column" gap="6" px="4">
      <Box bg="fill-white" borderRadius="2xl" p="6" w="full" maxW="500px" sm={{p: 10}}>
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="6">
            <Heading fontSize="heading.2" fontWeight="heading.1" color="text-primary">
              {t('signIn.title')}
            </Heading>

            <Text fontSize="text.base" color="text-secondary" lineHeight="normal">
              {t('signIn.description')}
            </Text>

            <TextInput
              required
              label={t('signIn.username')}
              errorText={errors.username?.message}
              {...register('username')}
            />

            <PasswordInput
              required
              label={t('signIn.password')}
              errorText={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" w="full" size="lg" mt="2" variant="primary" loading={isLoading}>
              {t('signIn.submit')} <RiArrowRightLine />
            </Button>
          </Flex>
        </form>
      </Box>

      <Text fontSize="text.base" color="text-secondary">
        {t('signIn.noAccount')} <Link href="/sign-up">{t('signIn.signUpLink')}</Link>
      </Text>
    </Flex>
  );
};
