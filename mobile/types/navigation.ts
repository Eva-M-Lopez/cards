export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Cards: undefined;
  ForgotPassword: undefined;
  Verify: { email: string };
  ResetPassword: { email: string; token: string };
};