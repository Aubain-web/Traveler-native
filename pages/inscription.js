import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

const Inscription = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Les mots de passe ne correspondent pas");
      return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    const formData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3001/pages/user/signIn', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      
      console.log(data);
      Alert.alert('Inscription réussie', `Bienvenue, ${firstName}!`);
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Échec de l\'inscription');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Inscription</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="S'inscrire" onPress={handleSignUp} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Inscription;
