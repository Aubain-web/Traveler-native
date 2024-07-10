import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';
import { useAuth } from '../Components/authContext';
import utilisateur from '../assets/utilisateur.png';

export default function UserFacture() {
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                Alert.alert('Erreur', 'Token invalide ou expiré.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/user/facture/getFacture', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Use the token here
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    Alert.alert('Erreur', errorData.message || 'Failed to fetch user data');
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setFactures(data);
            } catch (error) {
                Alert.alert('Erreur', 'Error fetching user data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const handleShowModal = (facture) => {
        setSelectedFacture(facture);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedFacture(null);
        setShowModal(false);
    };

    const renderFactureItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleShowModal(item)} style={styles.factureItem}>
            <Text>Facture ID: {item._id}</Text>
            <Text>Montant Payé: {item.montantPaye} {item.devise}</Text>
            <Text>Date: {item.date}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <>
                    <View style={styles.userInfo}>
                        <Image source={utilisateur} style={styles.userImage} />
                        <View style={styles.userDetails}>
                            <Text style={styles.infoText}>Nom: {user.lastName}</Text>
                            <Text style={styles.infoText}>Prénom: {user.firstName}</Text>
                            <Text style={styles.infoText}>Email: {user.email}</Text>
                        </View>
                    </View>
                    {factures.length > 0 ? (
                        <FlatList
                            data={factures}
                            renderItem={renderFactureItem}
                            keyExtractor={(item) => item._id.toString()}
                            contentContainerStyle={styles.factureList}
                        />
                    ) : (
                        <Text style={styles.noFacturesText}>Aucune facture trouvée.</Text>
                    )}
                    {selectedFacture && (
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showModal}
                            onRequestClose={handleCloseModal}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Détails de la Facture</Text>
                                    <Text>Montant Payé: {selectedFacture.montantPaye} {selectedFacture.devise}</Text>
                                    <Text>Prénom: {selectedFacture.firstName}</Text>
                                    <Text>Nom: {selectedFacture.lastName}</Text>
                                    <Text>Départ allé: {selectedFacture.aeroportDepart}</Text>
                                    <Text>Arrivée allé: {selectedFacture.aeroportArrivee}</Text>
                                    <Text>Départ retour: {selectedFacture.dateDepartRetour.split('T')[0]}</Text>
                                    <Text>Arrivée retour: {selectedFacture.dateArriveeRetour.split('T')[0]}</Text>
                                    <Button title="Fermer" onPress={handleCloseModal} />
                                </View>
                            </View>
                        </Modal>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userDetails: {
        flex: 1,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 5,
    },
    noFacturesText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    factureList: {
        paddingTop: 20,
    },
    factureItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
