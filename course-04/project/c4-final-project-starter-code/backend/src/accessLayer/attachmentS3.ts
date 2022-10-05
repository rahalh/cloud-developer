import * as XRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'


export class AttachmentS3 {
    constructor(
        private readonly s3Client = XRay.captureAWSClient(new AWS.S3()), 
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expiresIn = parseInt(process.env.SIGNED_URL_EXPIRATION),
        private readonly logger = createLogger('Attachment.S3')
    ) {}

    async createAttachmentPresignedUrl(key: string): Promise<string> {
        this.logger.info({method: 'createAttachmentPresignedUrl'})
        return await this.s3Client.getSignedUrlPromise('putObject', {
            Bucket: this.bucketName,
            Key: key,
            ContentType: 'application/octet-stream',
            Expires: this.expiresIn,
        })
    }
}