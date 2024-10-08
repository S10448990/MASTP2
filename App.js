/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route }) {
  const [menu, setMenu] = useState(route.params?.menu || []);
  const totalDishes = menu.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Christoffel's Menu</Text>
      <Text style={styles.subtitle}>Total Dishes: {totalDishes}</Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DishDetails', { dish: item })}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Add New Dish"
        color="#000"
        onPress={() => navigation.navigate('AddDish', { menu, setMenu })}
      />
    </View>
  );
}

function DishDetailsScreen({ route }) {
  const { dish } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dish.name}</Text>
      <Text style={styles.subtitle}>Description: {dish.description}</Text>
      <Text style={styles.subtitle}>Course: {dish.course}</Text>
      <Text style={styles.subtitle}>Price: {dish.price}</Text>
    </View>
  );
}

function AddDishScreen({ route, navigation }) {
  const { menu, setMenu } = route.params;
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  const predefinedCourses = ['Starter', 'Main', 'Dessert'];

  const addItem = () => {
    const newDish = {
      id: (menu.length + 1).toString(),
      name: dishName,
      description,
      course,
      price: `R${price}`,
    };
    setMenu([...menu, newDish]);
    navigation.navigate('Home', { menu: [...menu, newDish] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Menu Item</Text>

      <Text style={styles.label}>Dish Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Dish Name"
        placeholderTextColor="#bbb"
        value={dishName}
        onChangeText={setDishName}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        placeholderTextColor="#bbb"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Course:</Text>
      <Picker
        selectedValue={course}
        style={styles.input}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        {predefinedCourses.map((course) => (
          <Picker.Item key={course} label={course} value={course} />
        ))}
      </Picker>

      <Text style={styles.label}>Price (in Rands):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        placeholderTextColor="#bbb"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button color="#000" title="Add Item" onPress={addItem} />
    </View>
  );
}

export default function App() {
  const initialMenu = [
    { id: '1', name: 'Starter 1', description: 'Delicious Starter 1', course: 'Starter', price: 'R100' },
    { id: '2', name: 'Main 1', description: 'Hearty Main Course 1', course: 'Main', price: 'R200' },
    { id: '3', name: 'Dessert 1', description: 'Sweet Dessert 1', course: 'Dessert', price: 'R80' },
    { id: '4', name: 'Starter 2', description: 'Delicious Starter 2', course: 'Starter', price: 'R110' },
    { id: '5', name: 'Main 2', description: 'Hearty Main Course 2', course: 'Main', price: 'R250' },
    { id: '6', name: 'Dessert 2', description: 'Sweet Dessert 2', course: 'Dessert', price: 'R90' },
    { id: '7', name: 'Starter 3', description: 'Delicious Starter 3', course: 'Starter', price: 'R120' },
    { id: '8', name: 'Main 3', description: 'Hearty Main Course 3', course: 'Main', price: 'R300' },
    { id: '9', name: 'Dessert 3', description: 'Sweet Dessert 3', course: 'Dessert', price: 'R100' },
    { id: '10', name: 'Starter 4', description: 'Delicious Starter 4', course: 'Starter', price: 'R130' },
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ menu: initialMenu }}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="DishDetails"
          component={DishDetailsScreen}
          options={({ route }) => ({ title: route.params.dish.name })}
        />
        <Stack.Screen
          name="AddDish"
          component={AddDishScreen}
          options={{ title: 'Add New Dish' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#555',
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
