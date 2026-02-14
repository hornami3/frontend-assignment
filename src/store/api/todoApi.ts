import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from './baseQuery';
import type {CreateTodoRequest, Todo, TodoListResponse, UpdateTodoRequest} from './types';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<TodoListResponse, void>({
      query: () => '/todo/list',
      providesTags: (result) =>
        result
          ? [
              ...result.todos.map(({id}) => ({type: 'Todo' as const, id})),
              {type: 'Todo', id: 'LIST'},
            ]
          : [{type: 'Todo', id: 'LIST'}],
    }),
    getTodo: builder.query<Todo, string>({
      query: (id) => `/todo/${id}`,
      providesTags: (_result, _error, id) => [{type: 'Todo', id}],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (body) => ({
        url: '/todo',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{type: 'Todo', id: 'LIST'}],
    }),
    updateTodo: builder.mutation<Todo, {id: string} & UpdateTodoRequest>({
      query: ({id, ...body}) => ({
        url: `/todo/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, {id}) => [
        {type: 'Todo', id},
        {type: 'Todo', id: 'LIST'},
      ],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{type: 'Todo', id: 'LIST'}],
    }),
    completeTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todo/${id}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        {type: 'Todo', id},
        {type: 'Todo', id: 'LIST'},
      ],
    }),
    incompleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todo/${id}/incomplete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        {type: 'Todo', id},
        {type: 'Todo', id: 'LIST'},
      ],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useCompleteTodoMutation,
  useIncompleteTodoMutation,
} = todoApi;
