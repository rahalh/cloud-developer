import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

export class TodosAccess {
    constructor(
        private readonly docClient = new DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly LSI = process.env.TODOS_CREATED_AT_INDEX,
        private readonly logger = createLogger('TODO.DataLayer')
    ) {
        AWSXRay.captureAWSClient((docClient as any).service)
    }


    async getTodosForUser(uid: string): Promise<TodoItem[]> {
        this.logger.debug({method: 'getTodosForUser'})
        const result = await this.docClient.query({
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
        this.logger.debug({method: 'createTodo'})
        await this.docClient.put({
            TableName: this.todoTable,
            Item: {
               userId: todo.userId,
               todoId: todo.todoId,
               dueDate: todo.dueDate,
               name: todo.name,
               createdAt: todo.createdAt,
               done: todo.done
            }
        }).promise() as any
        return todo
    }   

    async updateTodo(uid: string, todoId: string, todo: TodoUpdate): Promise<void> {
        this.logger.debug({method: 'updateTodo'})
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                userId: uid,
                todoId: todoId
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
        }).promise() as any
    }

    async deleteTodo(uid: string, todoId: string): Promise<void> {
        this.logger.debug({method: 'deleteTodo'})
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                userId: uid,
                todoId: todoId
            }
        }).promise()
    }
}