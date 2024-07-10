import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomModal from '../Components/modalComponent';
import { useAuth } from '../Components/authContext';
import goBack from '../assets/filled_back_skip_icon_216850.svg';
import forward from '../assets/filled_forward_skip_icon_217024.svg';

const SearchResult = ({ items }) => {
    const route = useRoute();
    const { depart, arrive, dateDepart, dateArrive, adults, children } = route.params;

    const [flightData, setFlightData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFlightData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getFlightInfo?departure=${depart}&arrival=${arrive}&departureDate=${dateDepart}&returnDate=${dateArrive}&adults=${adults}&children=${children}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch flight information');
                }
                const data = await response.json();
                setFlightData(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching flight data:', error.message);
                setIsLoading(false);
                setError('Aucun résultat correspondant à votre recherche');
            }
        };

        fetchFlightData();
    }, [depart, arrive, dateDepart, dateArrive, adults, children]);

    const handleFlightClick = (flight) => {
        setSelectedFlight(flight);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const retour = () => {
        navigation.navigate('Accueil');
    };

    const aller = () => {
        navigation.navigate('Dashboard');
    };

    const renderFlightBlocks = () => {
        if (error && !isLoading && (!flightData || flightData.length === 0)) {
            return <Text style={styles.errorMessage}>{error}</Text>;
        }

        return flightData.map((flight, index) => (
            <TouchableOpacity key={index} style={styles.flightItem} onPress={() => handleFlightClick(flight)}>
                <Text>Flight ID: {flight.id}</Text>
                <Text>Instant Ticketing Required: {flight.instantTicketingRequired.toString()}</Text>
                <Text>Price: {flight.price?.total}</Text>
                <Text>Currency: {flight.price?.currency}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={retour}>
                        <Image
                            source={goBack}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Search result</Text>
                    <TouchableOpacity onPress={aller}>
                        <Image
                            source={forward}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.flightBlock}>{renderFlightBlocks()}</View>
                )}
            </View>
            {selectedFlight && (
                <CustomModal flight={selectedFlight} open={open} onClose={handleClose} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        width: 24,
        height: 24,
        marginHorizontal: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    flightBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flightItem: {
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

export default SearchResult;
