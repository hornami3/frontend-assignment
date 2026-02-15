import {useMemo} from 'react';
import {formatCurrentDate} from '../utils/formatCurrentDate';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Separator,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {RiAddLine} from 'react-icons/ri';
import {useNavigate} from 'react-router';
import {useGetMeQuery} from '../store/api/authApi';
import {useGetTodosQuery} from '../store/api/todoApi';
import {TodoItem} from '../components/TodoItem';
import logoSvg from '../assets/logo.svg';

export const Overview = () => {
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();
  const {data: user} = useGetMeQuery();
  const {data, isLoading} = useGetTodosQuery();

  const formattedDate = useMemo(
    () => formatCurrentDate(i18n.language),
    [i18n.language]
  );

  const {pending, completed} = useMemo(() => {
    const todos = data?.todos ?? [];
    return {
      pending: todos.filter((todo) => !todo.completed),
      completed: todos.filter((todo) => todo.completed),
    };
  }, [data]);

  return (
    <Flex direction="column" gap="6">
      <Flex
        flexDirection="column"
        justify="space-between"
        gap="4"
        align="flex-start"
        sm={{flexDirection: 'row'}}
      >
        <Box>
          <Heading fontSize="heading.1" fontWeight="heading.1" color="text-primary">
            {t('overview.greeting', {name: user?.username})}
          </Heading>
          <Text fontSize="text.small" color="text-tertiary" mt="1">
            {formattedDate}
          </Text>
        </Box>
        <Button
          variant="primary"
          onClick={() => navigate('/todo/new')}
          w="full"
          sm={{w: 'fit-content'}}
        >
          {t('overview.addTask')} <RiAddLine />
        </Button>
      </Flex>

      {isLoading && (
        <Box>
          <Skeleton height="6" width="100px" mb="2" />
          <Separator borderColor="border-gray" />
          {Array.from({length: 3}).map((_, i) => (
            <Flex align="center" gap="4" py="4" key={i}>
              <Skeleton borderRadius="full" width="32px" height="32px" flexShrink={0} />
              <Stack flex="1" gap="2">
                <Skeleton height="4" width="20%" />
                <Skeleton height="3" width="40%" />
              </Stack>
            </Flex>
          ))}
        </Box>
      )}

      {!isLoading && !pending.length && (
        <Flex direction="column" align="center" py="12" gap="4">
          <Image src={logoSvg} alt="logo" width="120px" height="105px" />
          <Heading fontSize="heading.3" fontWeight="heading.1" color="text-primary">
            {t('overview.emptyTitle')}
          </Heading>
          <Text fontSize="text.base" color="text-tertiary">
            {t('overview.emptyDescription')}
          </Text>
        </Flex>
      )}

      {!isLoading && !!pending.length && (
        <Box>
          <Heading fontSize="heading.3" fontWeight="heading.2" color="text-primary" mb="2">
            {t('overview.todo')}
          </Heading>
          <Separator borderColor="border-gray" />
          {pending.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </Box>
      )}

      {!isLoading && !!completed.length && (
        <Box>
          <Heading fontSize="heading.3" fontWeight="heading.2" color="text-primary" mb="2">
            {t('overview.completed')}
          </Heading>
          <Separator borderColor="border-gray" />
          {completed.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </Box>
      )}
    </Flex>
  );
};
