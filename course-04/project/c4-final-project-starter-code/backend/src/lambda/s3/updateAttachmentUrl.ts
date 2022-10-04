import { S3Event } from 'aws-lambda'
import { updateAttachmentUrl } from '../../businessLogic/todos'

export const handler = async (event: S3Event) => {
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name
        const regionCode = record.awsRegion
        const key = record.s3.object.key

        await updateAttachmentUrl(regionCode, bucketName, key)
    }
}