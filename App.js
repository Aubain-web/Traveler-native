import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './pages/home';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './Components/authContext';
import SearchResult from "./Components/searchResult";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Accueil') {
                        iconName = 'home';
                    } else if (route.name === 'Dashboard') {
                        iconName = 'grid-outline';
                    }

                    return <Ionicons name={iconName} color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Accueil" component={Home} options={{ title: 'Home' }} />
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
        </Tab.Navigator>
    );
};

// Définition de la logique de navigation principale
const AppNavigator = () => {
    const { isLoggedIn } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="AuthenticatedTabs" component={AuthenticatedTabs} />
                    <Stack.Screen name="SearchResult" component={SearchResult} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Inscription" component={Inscription} />
                </>
            )}
        </Stack.Navigator>
    );
};

// Composant principal de l'application
export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
