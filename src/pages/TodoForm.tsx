import {useEffect} from 'react';
import {Button, Flex, Heading, IconButton} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {object, string} from 'yup';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router';
import {RiArrowLeftLine, RiCheckLine} from 'react-icons/ri';
import {TextInput} from '../components/UI/TextInput';
import {TextareaInput} from '../components/UI/TextareaInput';
import {toaster} from '../components/UI/Toaster';
import {useGetTodoQuery, useCreateTodoMutation, useUpdateTodoMutation} from '../store/api/todoApi';

interface FormValues {
  title: string;
  description: string;
}

export const TodoForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const isEdit = !!id;

  const {data: todo} = useGetTodoQuery(id!, {skip: !isEdit});
  const [createTodo, {isLoading: isCreating}] = useCreateTodoMutation();
  const [updateTodo, {isLoading: isUpdating}] = useUpdateTodoMutation();

  const schema = object({
    title: string().required(t('validation.required', {field: t('todoForm.taskName')})),
    description: string().default(''),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {title: '', description: ''},
  });

  useEffect(() => {
    if (todo) {
      reset({title: todo.title, description: todo.description ?? ''});
    }
  }, [todo, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateTodo({
          id,
          title: data.title,
          description: data.description,
        }).unwrap();
      } else {
        await createTodo({title: data.title, description: data.description || undefined}).unwrap();
      }
      toaster.create({title: t(isEdit ? 'todoForm.updated' : 'todoForm.created'), type: 'success'});
      navigate('/overview');
    } catch {
      toaster.create({title: t('error.generic'), type: 'error'});
    }
  });

  return (
    <Flex direction="column" gap="8">
      <Flex
        direction="column"
        align="flex-start"
        gap="4"
        sm={{flexDirection: 'row', alignItems: 'center'}}
      >
        <IconButton variant="secondary" onClick={() => navigate(-1)}>
          <RiArrowLeftLine />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1" color="text-primary" truncate>
          {isEdit ? todo?.title : t('todoForm.newTask')}
        </Heading>
      </Flex>

      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="6">
          <TextInput
            required
            label={t('todoForm.taskName')}
            errorText={errors.title?.message}
            {...register('title')}
          />

          <TextareaInput label={t('todoForm.description')} {...register('description')} />

          <Flex
            direction="column"
            gap="2"
            mt="4"
            sm={{justifyContent: 'space-between', flexDirection: 'row'}}
          >
            <Button variant="secondary" onClick={() => navigate(-1)}>
              {isEdit ? t('todoForm.discardChanges') : t('todoForm.discard')}
            </Button>
            <Button type="submit" variant="primary" loading={isCreating || isUpdating}>
              {isEdit ? t('todoForm.saveChanges') : t('todoForm.createTask')} <RiCheckLine />
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};
