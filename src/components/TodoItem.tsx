import {useState} from 'react';
import {Box, Circle, Flex, IconButton, Menu, Portal, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {RiCheckLine, RiPencilFill, RiMore2Fill} from 'react-icons/ri';
import {IoMdTrash} from 'react-icons/io';
import {useNavigate} from 'react-router';
import {useCompleteTodoMutation, useIncompleteTodoMutation} from '../store/api/todoApi';
import type {Todo} from '../store/api/types';
import {toaster} from './UI/Toaster';
import {DeleteDialog} from './DeleteDialog';

export const TodoItem = ({todo}: {todo: Todo}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
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

  return (
    <Flex align="center" gap="4" py="4">
      <Box pt="1" cursor="pointer" onClick={handleToggle} flexShrink={0}>
        {todo.completed ? (
          <Circle size="32px" bg="fill-brand" color="text-white">
            <RiCheckLine size={18} />
          </Circle>
        ) : (
          <Circle size="32px" borderWidth="2px" borderColor="border-gray" />
        )}
      </Box>

      <Box flex="1" minW={0} cursor="pointer" onClick={() => navigate(`/todo/${todo.id}`)}>
        <Text fontSize="text.base" fontWeight="text.alternative" color="text-primary">
          {todo.title}
        </Text>
        {!!todo.description?.trim().length && (
          <Text fontSize="text.small" color="text-tertiary" mt="1" lineClamp={2}>
            {todo.description}
          </Text>
        )}
      </Box>

      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton variant="ghost" size="sm">
            <RiMore2Fill />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="160px" borderRadius="2xl" fontSize="text.small" p="0">
              <Menu.Item value="edit" onClick={() => navigate(`/todo/${todo.id}/edit`)} p="2.5">
                <RiPencilFill />
                {t('overview.edit')}
              </Menu.Item>
              <Menu.Item
                value="delete"
                color="text-danger"
                onClick={() => setIsDeleteDialogOpen(true)}
                p="2.5"
              >
                <IoMdTrash />
                {t('overview.delete')}
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <DeleteDialog
        open={isDeleteDialogOpen}
        todoId={todo.id}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </Flex>
  );
};
