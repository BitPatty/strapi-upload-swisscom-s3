'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint(config.host),
      ...config,
    });

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.upload(
            {
              Key: `${path}${file.hash}${file.ext}`,
              Body: Buffer.from(file.buffer, 'binary'),
              ACL: 'private',
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                console.log('== strapi-provider-upload-swisscom-s3 == upload err: ', err);
                return reject(err);
              }

              // set the file url
              file.url = `${strapi.config.currentEnvironment.server.proxy.host}/files/${data.Key}`;

              resolve();
            }
          );
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                console.log('== strapi-provider-upload-swisscom-s3 == delete err: ', err);
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },

  createBucketIfNotExists(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint(config.host),
      ...config,
    });
    console.log('== strapi-provider-upload-swisscom-s3 == createBucketIfNotExists:', config.params.Bucket)

    S3.listBuckets((err, data) => {
      if (err) console.log('== strapi-provider-upload-swisscom-s3 == Error listBuckets:', err);
      else {
        console.log('== strapi-provider-upload-swisscom-s3 == Existing bucket list:', data);
        // try to find my bucket in existing buckets
        const bucket = data.Buckets.find(b => b.Name === config.params.Bucket)
        // if it does not exist
        if (bucket) {
          console.log('== strapi-provider-upload-swisscom-s3 == Bucket already exists.');
          return;
        }

        console.log('== strapi-provider-upload-swisscom-s3 == Create new bucket....');
        // create my bucket
        S3.createBucket({ Bucket: config.params.Bucket }, (err, data) => {
          if (err) console.log('== strapi-provider-upload-swisscom-s3 == Error createBucket:', err);
          else console.log('== strapi-provider-upload-swisscom-s3 == Success createBucket:', data);
        });
      }
    })
  },

  getObject(config, key) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint(config.host),
      ...config,
    });

    const params = {
      Bucket: config.params.Bucket,
      Key: key
    };
    return new Promise((resolve, reject) => {
      S3.getObject(params, function (err, data) {
        if (err) reject(err); // an error occurred
        else resolve(data);   // successful response
      });
    });
  }
};
