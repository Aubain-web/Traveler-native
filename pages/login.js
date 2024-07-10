import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../Components/authContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/pages/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const data = await response.json();
      if (data.token) {
        login(data);
      } else {
        throw new Error('Token non trouvé dans la réponse');
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Traveler</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.textRedirect} onPress={() => navigation.navigate('Inscription')}>
          Vous n'avez pas de compte ?
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
        {error && <Text style={styles.errorText}>Erreur: {error.message}</Text>}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 15,
    textAlign: 'center',
  },
  textRedirect: {
    color: 'green',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'gray',
    opacity: 0.7,
    color: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;
