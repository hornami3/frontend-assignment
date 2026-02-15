import {Button, Dialog, Portal, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {useDeleteTodoMutation} from '../store/api/todoApi';
import {toaster} from './UI/Toaster';
import {useNavigate} from 'react-router';

interface DeleteDialogProps {
  open: boolean;
  todoId: string;
  onOpenChange: (open: boolean) => void;
}

export const DeleteDialog = ({open, todoId, onOpenChange}: DeleteDialogProps) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleConfirm = async () => {
    try {
      await deleteTodo(todoId).unwrap();
      toaster.create({title: t('todoDetail.deleted'), type: 'success'});
      navigate('/overview');
      onOpenChange(false);
    } catch {
      toaster.create({title: t('error.generic'), type: 'error'});
    }
  };

  return (
    <Dialog.Root
      role="alertdialog"
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="heading.2" fontWeight="heading.2">
                {t('overview.deleteConfirmTitle')}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{t('overview.deleteConfirmMessage')}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('overview.cancel')}
              </Button>
              <Button colorPalette="red" onClick={handleConfirm}>
                {t('overview.delete')}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
