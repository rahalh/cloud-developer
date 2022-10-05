import * as XRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const aws = XRay.captureAWS(AWS)

export class TodosDDB {
    constructor(
        private readonly ddbClient = new aws.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly LSI = process.env.TODOS_CREATED_AT_INDEX,
        private readonly logger = createLogger('TODO.DDB')
    ) {}

    async getTodosForUser(uid: string): Promise<TodoItem[]> {
        this.logger.info({input: {uid}})
        const result = await this.ddbClient.query({
            TableName: this.todoTable,
            IndexName: this.LSI,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": uid
            }
        }).promise()

        return result.Items as any[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        this.logger.info({input: {todo}})
        await this.ddbClient.put({
            TableName: this.todoTable,
            Item: {
               userId: todo.userId,
               todoId: todo.todoId,
               dueDate: todo.dueDate,
               name: todo.name,
               createdAt: todo.createdAt,
               done: todo.done
            }
        }).promise()
        return todo
    }   

    async updateTodo(uid: string, todoId: string, todo: TodoUpdate): Promise<void> {
        this.logger.info({input: {uid, todoId, todo}})
        await this.ddbClient.update({
            TableName: this.todoTable,
            Key: {
                userId: uid,
                todoId
            },
            UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": todo.name,
                ":dueDate": todo.dueDate,
                ":done": todo.done
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        }).promise()
    }

    async deleteTodo(uid: string, todoId: string): Promise<void> {
        this.logger.info({input: {uid, todoId}})
        await this.ddbClient.delete({
            TableName: this.todoTable,
            Key: {
                userId: uid,
                todoId: todoId
            }
        }).promise()
    }

    async updateAttachmentUrl(uid: string, todoId: string, attachmentUrl: string): Promise<void> {
        this.logger.info({input: {uid, todoId, attachmentUrl}})
        await this.ddbClient.update({
            TableName: this.todoTable,
            Key: {
                userId: uid,
                todoId: todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl
            }
        }).promise()
    }
}