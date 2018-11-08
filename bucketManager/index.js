const AWS = require('aws-sdk');

class BucketManager {
  constructor(config) {
    AWS.config.update({
      accessKeyId: config.public,
      secretAccessKey: config.private
    });

    this.S3 = new AWS.S3({
      endpoint: new AWS.Endpoint(config.host),
      apiVersion: '2006-03-01',
      params: {
        Bucket: config.bucket
      }
    });
  }

  async listBuckets() {
    await this.S3.listBuckets((err, data) => {
      if (err) console.log('Error', err);
      else {
        console.log('Bucket list', data);
      }
    });
  }

  async createBucket(bucketName) {
    await this.S3.createBucket({ Bucket: bucketName }, (err, data) => {
      if (err) console.log('Error', err);
      else console.log('Success', data);
    });
  }

  async deleteBucket(bucket) {
    this.S3.deleteBucket(
      {
        Bucket: bucket
      },
      (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  }

  async deleteObject(bucket, objectName) {
    await this.S3.deleteObject(
      {
        Bucket: bucket,
        Key: objectName
      },
      (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  }

  async listObjects(bucket) {
    await this.S3.listObjects(
      {
        Bucket: bucket
      },
      (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  }

  async putObjectAcl(bucket, objectName, acl) {
    await this.S3.putObjectAcl(
      {
        Bucket: bucket,
        Key: objectName,
        ACL: acl
      },
      (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  }
};



config = {
  "host": "ds11s3.swisscom.com",
  "public": "----------------------------------------",
  "private": "-------------------------------------",
  "namespace": "-------------------",
  "namespaceHost": "",
  "bucket": "my-test-bucket"
}

const bucketManager = new BucketManager(config)
bucketManager.listBuckets()