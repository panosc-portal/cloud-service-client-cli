
export class AccountCreatorDto {
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  uid: number;
  gid: number;
  homePath: string;
  email: string;

  constructor(data?: Partial<AccountCreatorDto>) {
    Object.assign(this, data);
  }
}
