import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    Button,
    View,
    Text,
    Platform,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import { useNavigation } from '@react-navigation/native';
import 'react-datepicker/dist/react-datepicker.css';
import Dictionnaireville from "../dictionnaires/dictionnaireVille";
const background = require('../assets/vue-dessus-passeports-billets.jpg');

const Search = () => {
    const [depart, setDepart] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [showDeparturePicker, setShowDeparturePicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const [error, setError] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const navigation = useNavigation();

    const onChangeDeparture = (event, selectedDate) => {
        const currentDate = selectedDate || departureDate;
        setShowDeparturePicker(Platform.OS === 'ios');
        setDepartureDate(currentDate);
    };

    const onChangeReturn = (event, selectedDate) => {
        const currentDate = selectedDate || returnDate;
        setShowReturnPicker(Platform.OS === 'ios');
        setReturnDate(currentDate);
    };

    const handleSearch = () => {
        if (depart && destination && departureDate && returnDate && adults >= 1) {
            setError('');
            const translatedDepart = Dictionnaireville()[depart] || depart;
            const translatedArrive = Dictionnaireville()[destination] || destination;
            const dateDepart = departureDate.toISOString().split('T')[0];
            const dateArrive = returnDate.toISOString().split('T')[0];
            navigation.navigate('SearchResult', {
                depart: translatedDepart,
                arrive: translatedArrive,
                dateDepart,
                dateArrive,
                adults,
                children
            });
            console.log('Recherche:', { depart, destination, departureDate, returnDate, adults, children });
        } else {
            setError('Tous les champs doivent être remplis');
        }
    };

    const incrementAdults = () => {
        if (adults < 9) {
            setAdults(adults + 1);
        }
    };

    const decrementAdults = () => {
        if (adults > 1) {
            setAdults(adults - 1);
        }
    };

    const incrementChildren = () => {
        if (children < 9) {
            setChildren(children + 1);
        }
    };

    const decrementChildren = () => {
        if (children > 0) {
            setChildren(children - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={setDepart}
                    value={depart}
                    placeholder="Départ"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setDestination}
                    value={destination}
                    placeholder="Destination"
                />
                {Platform.OS !== 'web' ? (
                    <>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => setShowDeparturePicker(true)} title="Choisir la date de départ" />
                        </View>
                        {showDeparturePicker && (
                            <DateTimePicker
                                testID="departureDateTimePicker"
                                value={departureDate}
                                mode="date"
                                display="default"
                                onChange={onChangeDeparture}
                            />
                        )}
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => setShowReturnPicker(true)} title="Choisir la date de retour" />
                        </View>
                        {showReturnPicker && (
                            <DateTimePicker
                                testID="returnDateTimePicker"
                                value={returnDate}
                                mode="date"
                                display="default"
                                onChange={onChangeReturn}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <Text>Date de départ</Text>
                        <DatePicker
                            selected={departureDate}
                            onChange={(date) => setDepartureDate(date)}
                            dateFormat="P"
                        />
                        <Text>Date de retour</Text>
                        <DatePicker
                            selected={returnDate}
                            onChange={(date) => setReturnDate(date)}
                            dateFormat="P"
                        />
                    </>
                )}
                <View style={styles.selectorContainer}>
                    <View style={styles.selector}>
                        <Text>Adultes</Text>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity onPress={decrementAdults} disabled={adults <= 1} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{adults}</Text>
                            <TouchableOpacity onPress={incrementAdults} disabled={adults >= 9} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.selector}>
                        <Text>Enfants</Text>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity onPress={decrementChildren} disabled={children <= 0} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{children}</Text>
                            <TouchableOpacity onPress={incrementChildren} disabled={children >= 9} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Button title="Rechercher" onPress={handleSearch} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginLeft : '5%',
        marginRight : '5%',
        backgroundColor: '#1E1E1E',
    },
    image:{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 12,
    },
    dateText: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 6,
    },
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    selector: {
        alignItems: 'center',
        width: '48%',
    },
    selectorText: {
        fontSize: 16,
        marginBottom: 6,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 12,
    },
    counterButton: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
    },
    counterButtonText: {
        color: 'white',
        fontSize: 18,
    },
    counterValue: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default Search;
