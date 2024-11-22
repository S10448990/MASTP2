import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Button, Picker } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route }) {
  const [menu, setMenu] = useState(route.params?.menu || []);
  const [selectedCourse, setSelectedCourse] = useState('All');
  
  // Calculate the average price of the dishes
  const calculateAveragePrice = () => {
    const total = menu.reduce((sum, item) => sum + parseFloat(item.price.replace('R', '')), 0);
    return (total / menu.length).toFixed(2);
  };

  const filterMenu = (course) => {
    if (course === 'All') return menu;
    return menu.filter(dish => dish.course === course);
  };

  const filteredMenu = filterMenu(selectedCourse);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Christoffel's Menu</Text>
      <Text style={styles.subtitle}>Average Price: R{calculateAveragePrice()}</Text>
      <Text style={styles.subtitle}>Total Dishes: {menu.length}</Text>

      <Text style={styles.label}>Filter by Course:</Text>
      <Picker
        selectedValue={selectedCourse}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedCourse(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Starter" value="Starter" />
        <Picker.Item label="Main" value="Main" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      <FlatList
        data={filteredMenu}
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
    if (dishName.trim() && description.trim() && price.trim()) {
      const newDish = {
        id: (menu.length + 1).toString(),
        name: dishName,
        description,
        course,
        price: `R${price}`,
      };
      setMenu([...menu, newDish]);
      navigation.navigate('Home', { menu: [...menu, newDish] });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const removeItem = (id) => {
    const updatedMenu = menu.filter(item => item.id !== id);
    setMenu(updatedMenu);
    navigation.navigate('Home', { menu: updatedMenu });
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

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Button
              title="Remove"
              color="#ff0000"
              onPress={() => removeItem(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

export default function App() {
  const initialMenu = [
    { id: '1', name: 'Starter 1', description: 'Delicious Starter 1', course: 'Starter', price: 'R100' },
    { id: '2', name: 'Starter 2', description: 'Tasty Starter 2', course: 'Starter', price: 'R120' },
    { id: '3', name: 'Main 1', description: 'Hearty Main Course 1', course: 'Main', price: 'R200' },
    { id: '4', name: 'Main 2', description: 'Savory Main Course 2', course: 'Main', price: 'R250' },
    { id: '5', name: 'Dessert 1', description: 'Sweet Dessert 1', course: 'Dessert', price: 'R80' },
    { id: '6', name: 'Dessert 2', description: 'Rich Dessert 2', course: 'Dessert', price: 'R90' },
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
    justifyContent: 'flex-start', // Ensure layout is stackable
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
    borderRadius: 5, // Added for better interaction
  },
  item: {
    padding: 15,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: 10,
    zIndex: 10, 
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    position: 'relative', 
    zIndex: 20, 
  },
});
