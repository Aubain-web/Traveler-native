import React from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../Components/authContext';
import TimePeriod from '../dictionnaires/dictionnaireTime';
import AircraftDictionary from '../dictionnaires/dictionnaireAircraft';
import CompagnieCarrier from '../dictionnaires/dictionnaireIata';
import Dictionnaireville from '../dictionnaires/dictionnaireVille';
import AirportCode from '../dictionnaires/aeroportCode';

const ModalComponent = ({ flight, open, onClose }) => {
    const { user, isLoggedIn, token} = useAuth();
    const compagnieAerienne = CompagnieCarrier()[flight.itineraries[0].segments[0].carrierCode];
    const aeroportArrivee = AirportCode()[flight.itineraries[0].segments[0].arrival.iataCode];
    const aeroportDepart = AirportCode()[flight.itineraries[0].segments[0].departure.iataCode];
    const dureAller = TimePeriod()[flight.itineraries[0].duration];

    if (!flight) {
        return null;
    }

    const retourSegment = flight.itineraries[1]?.segments[0];
    const compagnieAerienneRetour = retourSegment ? CompagnieCarrier()[retourSegment.carrierCode] : null;
    const aeroportDepartRetour = retourSegment ? AirportCode()[retourSegment.departure.iataCode] : null;
    const aeroportArriveeRetour = retourSegment ? AirportCode()[retourSegment.arrival.iataCode] : null;
    const dureRetour = TimePeriod()[flight.itineraries[1].duration];

    const handlePayment = async () => {
        if (!isLoggedIn) {
            alert('Vous devez vous connecter pour effectuer un paiement.');
            return;
        }

        const infoLog = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            adults: flight.travelerPricings.filter(tp => tp.travelerType === 'ADULT').length,
            children: flight.travelerPricings.filter(tp => tp.travelerType === 'CHILD').length,
            compagnieAerienne: compagnieAerienne,
            aeroportDepart: aeroportDepart,
            aeroportArrivee: aeroportArrivee,
            dateDepart: flight.itineraries[0].segments[0].departure.at.split('T')[0],
            heureDepart: flight.itineraries[0].segments[0].departure.at.split('T')[1],
            dateArrivee: flight.itineraries[0].segments[0].arrival.at.split('T')[0],
            heureArrivee: flight.itineraries[0].segments[0].arrival.at.split('T')[1],
            numeroSiege: '12A',
            classe: flight.travelerPricings[0].fareDetailsBySegment[0].cabin,
            montantPaye: parseFloat(flight.price.total),
            devise: flight.price.currency,
            taxes: parseFloat(flight.price.totalTaxes || 0),
            fraisSupplementaires: 0,
            instructionsVoyage: 'Aucune',

            // Ajout des informations du vol retour
            compagnieAerienneRetour: compagnieAerienneRetour,
            aeroportDepartRetour: aeroportDepartRetour,
            aeroportArriveeRetour: aeroportArriveeRetour,
            dateDepartRetour: retourSegment ? retourSegment.departure.at.split('T')[0] : null,
            heureDepartRetour: retourSegment ? retourSegment.departure.at.split('T')[1] : null,
            dateArriveeRetour: retourSegment ? retourSegment.arrival.at.split('T')[0] : null,
            heureArriveeRetour: retourSegment ? retourSegment.arrival.at.split('T')[1] : null,
            dureeAller: dureAller,
            dureeRetour: dureRetour,
        };

        try {
            const response = await fetch('http://localhost:3001/user/facture/create', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.trim()}`,
                },
                body: JSON.stringify(infoLog),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response data:', errorData);
                throw new Error('Failed to create invoice');
            }

            const data = await response.json();
            console.log('Invoice created successfully:', data);
            onClose();
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <Modal
            visible={open}
            onRequestClose={onClose}
            transparent
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <ScrollView>
                        <View style={styles.modalDetails}>
                            <Text style={styles.modalTitle}>Détails du billet</Text>
                            <View style={styles.table}>
                                {isLoggedIn && (
                                    <>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>ID:</Text>
                                            <Text style={styles.tableCell}>{flight.id}</Text>
                                        </View>
                                    </>
                                )}
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Compagnie Aérienne:</Text>
                                    <Text style={styles.tableCell}>{compagnieAerienne}</Text>
                                </View>
                                {isLoggedIn && (
                                    <>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Nom:</Text>
                                            <Text style={styles.tableCell}>{user.lastName}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Prénom:</Text>
                                            <Text style={styles.tableCell}>{user.firstName}</Text>
                                        </View>
                                    </>
                                )}
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Adulte(s):</Text>
                                    <Text style={styles.tableCell}>{flight.travelerPricings.filter(tp => tp.travelerType === 'ADULT').length}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Prix:</Text>
                                    <Text style={styles.tableCell}>{flight.price.total} {flight.price.currency}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Classe:</Text>
                                    <Text style={styles.tableCell}>{flight.travelerPricings[0].fareDetailsBySegment[0].cabin}</Text>
                                </View>
                                <Text style={styles.subTitle}>Aller</Text>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Aéroport de départ:</Text>
                                    <Text style={styles.tableCell}>{aeroportDepart}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Départ:</Text>
                                    <Text style={styles.tableCell}>{flight.itineraries[0].segments[0].departure.at}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Aéroport d'arrivée:</Text>
                                    <Text style={styles.tableCell}>{aeroportArrivee}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Date d'arrivée:</Text>
                                    <Text style={styles.tableCell}>{flight.itineraries[0].segments[0].arrival.at}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Durée aller:</Text>
                                    <Text style={styles.tableCell}>{dureAller}</Text>
                                </View>
                                {retourSegment && (
                                    <>
                                        <Text style={styles.subTitle}>Retour</Text>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Compagnie Aérienne:</Text>
                                            <Text style={styles.tableCell}>{compagnieAerienneRetour}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Aéroport de départ:</Text>
                                            <Text style={styles.tableCell}>{aeroportDepartRetour}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Départ:</Text>
                                            <Text style={styles.tableCell}>{retourSegment.departure.at}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Aéroport d'arrivée:</Text>
                                            <Text style={styles.tableCell}>{aeroportArriveeRetour}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Date d'arrivée:</Text>
                                            <Text style={styles.tableCell}>{retourSegment.arrival.at}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableCell}>Durée retour:</Text>
                                            <Text style={styles.tableCell}>{dureRetour}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                        <View style={styles.option}>
                            <Button title="Payer" onPress={handlePayment} color="#1976d2" />
                            <Button title="Annuler" onPress={onClose} color="#f44336" />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBox: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    modalDetails: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableCell: {
        fontSize: 16,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    option: {
        marginTop: 10,
    },
});

export default ModalComponent;
