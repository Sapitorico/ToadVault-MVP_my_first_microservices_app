import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService {
  private client: MongoClient;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      this.client = new MongoClient(process.env.DB_CONN_STRING);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  getDb() {
    return this.client.db(process.env.DB_NAME);
  }
}
