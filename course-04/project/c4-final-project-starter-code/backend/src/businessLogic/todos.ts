import { TodosAccess } from '../accessLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('Todo.BusinessLogic')
const todoAccess = new TodosAccess()

export async function getTodosForUser(uid: string): Promise<TodoItem[]> {
  logger.debug({method: 'getTodoForUser'})
  return todoAccess.getTodosForUser(uid)
}

export async function createTodo(
  uid: string,
  req: CreateTodoRequest
): Promise<TodoItem> {
  logger.debug({method: 'createTodo'})
  return await todoAccess.createTodo({
    ...req,
    userId: uid,
    todoId: uuid.v4(),
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(
  uid: string,
  todoId: string,
  req: UpdateTodoRequest
) {
  logger.debug({method: 'updateTodo'})
  return await todoAccess.updateTodo(uid, todoId, req)
}

export async function deleteTodo(uid: string, todoId: string) {
  logger.debug({method: 'deleteTodo'})
  await todoAccess.deleteTodo(uid, todoId)
}
