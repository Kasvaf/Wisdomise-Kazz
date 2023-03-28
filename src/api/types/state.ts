interface UserData {
  jwtToken: string;
  email: string;
}

export interface State {
  user: UserData | null;
}
