import type { Habit } from "@/lib/models/Habit";
import { createHabit, getHabits } from "@/lib/services/habitService";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      const habits = await getHabits();
      setHabits(habits);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setLoading(false);
    }
  }

  async function createSampleHabit() {
    try {
      const id = await createHabit({
        name: "Sample Habit " + Date.now(),
        type: "build",
        userId: null,
      });
      console.log("Sample habit created with id:", id);
      fetchHabits();
    } catch (error) {
      console.error("Error creating sample habit:", error);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resilience</Text>
      <Button title="+ Create Sample Habit" onPress={createSampleHabit} />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitCard}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitType}>{item.type}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No habits found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  habitCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  habitName: {
    fontSize: 16,
    color: "#000",
  },
  habitType: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
  },
});
