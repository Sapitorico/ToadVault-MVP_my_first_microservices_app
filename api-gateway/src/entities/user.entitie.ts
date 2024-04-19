export interface UserData {
  name: string;
  email: string;
  password: string;
}

export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
