import { initDatabase } from "@/lib/database";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        console.log("Database initialized");
        setDbInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    }
    setup();
  },[]);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Stack />;
}
