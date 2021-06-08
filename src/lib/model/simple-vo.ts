import { BaseVO } from './base-vo';

export interface SimpleVO extends BaseVO {
  key: string;
  value: string | boolean | PresignedUrlResponse;
}

export type PresignedUrlResponse = {
  destinationUrl: string;
  presignedPost: PresignedPost;
};

export type PresignedPost = {
  url: string;
  fields: {
    [key: string]: string;
  };
};
