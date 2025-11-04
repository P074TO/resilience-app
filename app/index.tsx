import type { Habit, HabitType } from "@/lib/models/Habit";
import {
  archiveHabit as archiveHabitService,
  createHabit as createHabitService,
  deleteHabit as deleteHabitService,
  readHabits as readHabitsService,
  unarchiveHabit as unarchiveHabitService,
  updateHabit as updateHabitService,
} from "@/lib/services/habitService";
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
      const habits = await readHabitsService();
      setHabits(habits);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setLoading(false);
    }
  }

  async function createSampleHabit() {
    try {
      const id = await createHabitService({
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

  async function updateHabit(id: string, name: string, type: HabitType) {
    try {
      await updateHabitService(id, { name, type });
      console.log("Habit updated:", id);
      fetchHabits();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  }

  async function archiveHabit(id: string) {
    try {
      await archiveHabitService(id);
      console.log("Habit archived:", id);
      fetchHabits();
    } catch (error) {
      console.error("Error archiving habit:", error);
    }
  }

  async function unarchiveHabit(id: string) {
    try {
      await unarchiveHabitService(id);
      console.log("Habit unarchived:", id);
      fetchHabits();
    } catch (error) {
      console.error("Error unarchiving habit:", error);
    }
  }

  async function deleteHabit(id: string) {
    try {
      await deleteHabitService(id);
      console.log("Habit deleted:", id);
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
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
        data={habits.filter((h) => !h.archived)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.habitName}>{item.name}</Text>
            </View>
            <Text style={styles.habitType}>{item.type}</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              <Button
                title="Update"
                onPress={() => updateHabit(item.id, "Updated Habit", "quit")}
                testID={`update-${item.id}`}
              />
              <Button
                title="Archive"
                onPress={() => archiveHabit(item.id)}
                testID={`archive-${item.id}`}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No habits found</Text>}
      />

      {habits.some((h) => h.archived) && (
        <View style={{ marginTop: 24 }}>
          <Text style={[styles.title, { fontSize: 18 }]}>Archived Habits</Text>
          <FlatList
            data={habits.filter((h) => h.archived)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.habitCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.habitName}>{item.name}</Text>
                </View>
                <Text style={styles.habitType}>{item.type}</Text>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                  <Button
                    title="Delete"
                    onPress={() => deleteHabit(item.id)}
                    color="#d00"
                    testID={`delete-${item.id}`}
                  />
                  <Button
                    title="Unarchive"
                    onPress={() => unarchiveHabit(item.id)}
                    color="#d00"
                    testID={`unarchive-${item.id}`}
                  />
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>No archived habits</Text>}
          />
        </View>
      )}
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
