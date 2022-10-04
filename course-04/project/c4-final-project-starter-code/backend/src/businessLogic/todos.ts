import { TodosDDB } from '../accessLayer/todosDDB'
import { AttachmentS3 } from '../accessLayer/attachmentS3'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('Todo.BusinessLogic')
const todoAccess = new TodosDDB()
const todoAttachment = new AttachmentS3()

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

export async function createAttachmentPresignedUrl(uid: string, todoId: string): Promise<string> {
  logger.debug({method: 'createAttachmentPresignedUrl'})
  const key = `${uid}/${todoId}`
  return await todoAttachment.createAttachmentPresignedUrl(key)
}

export async function updateAttachmentUrl(regionCode, bucketName, key: string) {
  logger.debug({method: 'updateAttachmentUrl'})
  
  const attachmentUrl = `https://s3.${regionCode}.amazonaws.com/${bucketName}/${key}`
  const [userId, todoId] = decodeURI(key).split('/')
  await todoAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)
}