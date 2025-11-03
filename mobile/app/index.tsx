import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to login screen
  return <Redirect href="/login" />;
}