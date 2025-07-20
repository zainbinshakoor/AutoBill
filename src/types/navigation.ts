import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Expense } from './index';

// Define the root stack param list
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Camera: { expense?: Expense } | undefined;
  ExpenseDetail: { expense: Expense };
};

// Navigation prop types for each screen
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
export type ExpenseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExpenseDetail'>;

// Route prop types for each screen
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignupScreenRouteProp = RouteProp<RootStackParamList, 'Signup'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;
export type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

// Combined props types for screens
export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

export type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

export type CameraScreenProps = {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
};

export type ExpenseDetailScreenProps = {
  navigation: ExpenseDetailScreenNavigationProp;
  route: ExpenseDetailScreenRouteProp;
};