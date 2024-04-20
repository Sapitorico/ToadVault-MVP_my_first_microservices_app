import { ObjectId } from 'mongodb';

export interface userData {
  _id?: ObjectId;
  name?: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export class User {
  constructor(
    private name: string,
    private email: string,
    private password: string,
    private created_at: Date,
    private updated_at: Date,
  ) {}
}
