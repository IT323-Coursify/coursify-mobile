import { Tabs } from "expo-router";
import { Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function TabsLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 90,        // same height as your previous footer
                    paddingTop: 6,       // space above icons
                    paddingBottom: 3,
                    borderTopWidth: 0, // optional: remove top border
                },
                tabBarBackground: () => (
                    <LinearGradient
                        colors={["#4da3f5", "#2bbbad"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                ),
            }}
        >
            {/* Dashboard Tab */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? "#ffffffff" : "#f0efefff",       // change color
                                fontWeight: focused ? "bold" : "normal",   // bold when active
                                fontSize: focused ? 12 : 12,               // bigger when active
                            }}>Dashboard</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../../assets/dashboard-active.png")
                                    : require("../../assets/dashboard-inactive.png")
                            }
                            style={{ width: 24, height: 24 }}
                        />
                    ),
                }}
            />

            {/* Assessment Tab */}
            <Tabs.Screen
                name="assessment"
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? "#ffffffff" : "#f0efefff",       // change color
                                fontWeight: focused ? "bold" : "normal",   // bold when active
                                fontSize: focused ? 12 : 12,               // bigger when active
                            }}>Assessment</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../../assets/assessment-active.png")
                                    : require("../../assets/assessment-inactive.png")
                            }
                            style={{ width: 24, height: 24 }}
                        />
                    ),
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? "#ffffffff" : "#f0efefff",       // change color
                                fontWeight: focused ? "bold" : "normal",   // bold when active
                                fontSize: focused ? 12 : 12,               // bigger when active
                            }}>Profile</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../../assets/profile-active.png")
                                    : require("../../assets/profile-inactive.png")
                            }
                            style={{ width: 24, height: 24 }}
                        />
                    ),
                }}
            />

        </Tabs>
    );
}