export interface IAuth {
  login: (
    email: string,
    password: string
  ) => Promise<{ token: string; email: string; id: string; name: string }>;
}
