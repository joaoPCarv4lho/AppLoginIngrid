import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebase/config';

export default function HomeScreen(props) {
    const [entityText, setEntityText] = useState('');
    const [entities, setEntities] = useState([]);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const userID = props.extraData.id;

    useEffect(() => {
        const entityRef = collection(firestore, 'entities');
        const q = query(entityRef, where('authorID', '==', userID), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newEntities = [];
            querySnapshot.forEach((doc) => {
                const entity = doc.data();
                entity.id = doc.id;
                newEntities.push(entity);
            });
            setEntities(newEntities);
        }, (error) => {
            console.error(error);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: serverTimestamp(),
            };
            addDoc(collection(firestore, 'entities'), data)
                .then(() => {
                    setEntityText('');
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    const renderEntity = ({ item, index }) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {index + 1}. {item.text}
                </Text>
            </View>
        );
    };

    const onLogoutPress = () => {
        signOut(auth)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error('Error during logout: ', error);
                alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new entity'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onLogoutPress}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            {entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    );
}
