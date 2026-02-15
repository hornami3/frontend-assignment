import {useState} from 'react';
import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router';
import {RiArrowLeftLine, RiCheckLine, RiPencilFill} from 'react-icons/ri';
import {IoMdTrash} from 'react-icons/io';
import {DeleteDialog} from '../components/DeleteDialog';
import {toaster} from '../components/UI/Toaster';
import {
  useGetTodoQuery,
  useCompleteTodoMutation,
  useIncompleteTodoMutation,
} from '../store/api/todoApi';

export const TodoDetail = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const {data: todo, isLoading} = useGetTodoQuery(id!);
  const [completeTodo] = useCompleteTodoMutation();
  const [incompleteTodo] = useIncompleteTodoMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggle = async () => {
    try {
      if (todo?.completed) {
        await incompleteTodo(todo.id).unwrap();
        toaster.create({title: t('todoDetail.incompleted'), type: 'success'});
      } else if (todo) {
        await completeTodo(todo.id).unwrap();
        toaster.create({title: t('todoDetail.completed'), type: 'success'});
      }
    } catch {
      toaster.create({title: t('error.generic'), type: 'error'});
    }
  };

  if (isLoading) {
    return (
      <Flex direction="column" gap="8">
        <Flex align="center" gap="4">
          <Skeleton borderRadius="xl" width="40px" height="40px" />
          <Skeleton height="6" width="200px" />
        </Flex>
        <Stack gap="4">
          <Skeleton height="4" width="100px" />
          <Skeleton height="4" width="80%" />
          <Skeleton height="4" width="60%" />
        </Stack>
      </Flex>
    );
  }

  if (!todo) return null;

  return (
    <Flex direction="column" gap="8">
      <Flex
        direction="column"
        align="flex-start"
        gap="4"
        sm={{flexDirection: 'row', alignItems: 'center'}}
      >
        <IconButton variant="secondary" onClick={() => navigate('/overview')}>
          <RiArrowLeftLine />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1" color="text-primary" truncate>
          {todo.title}
        </Heading>
      </Flex>

      <Flex align="center" gap="3" cursor="pointer" onClick={handleToggle}>
        {todo.completed ? (
          <Circle size="32px" bg="fill-brand" color="text-white">
            <RiCheckLine size={18} />
          </Circle>
        ) : (
          <Circle size="32px" borderWidth="2px" borderColor="border-gray" />
        )}
        <Text fontSize="text.base" color="text-secondary">
          {todo.completed ? t('todoDetail.markIncomplete') : t('todoDetail.markCompleted')}
        </Text>
      </Flex>

      {!!todo.description?.trim().length && (
        <Box>
          <Text fontSize="text.small" color="text-tertiary" mb="2">
            {t('todoDetail.description')}
          </Text>
          <Text fontSize="text.base" color="text-primary" whiteSpace="pre-wrap">
            {todo.description}
          </Text>
        </Box>
      )}

      <Flex direction="column" gap="2" mt="4" sm={{flexDirection: 'row'}}>
        <Button variant="primary" onClick={() => navigate(`/todo/${todo.id}/edit`)}>
          <RiPencilFill /> {t('overview.edit')}
        </Button>
        <Button variant="secondary" color="text-danger" onClick={() => setIsDeleteDialogOpen(true)}>
          <IoMdTrash /> {t('overview.delete')}
        </Button>
      </Flex>

      <DeleteDialog
        open={isDeleteDialogOpen}
        todoId={todo.id}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </Flex>
  );
};
