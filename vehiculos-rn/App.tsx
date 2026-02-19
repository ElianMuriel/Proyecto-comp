import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ServiceTypesScreen from "./src/screens/ServiceTypesScreen";
import VehicleServicesScreen from "./src/screens/VehicleServicesScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ServiceTypes: undefined;
  VehicleServices: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="ServiceTypes" component={ServiceTypesScreen} options={{ title: "Service Types" }} />
        <Stack.Screen name="VehicleServices" component={VehicleServicesScreen} options={{ title: "Vehicle Services" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}