import { VStack, Text, HStack, Heading } from "@gluestack-ui/themed";
import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { useState } from "react";
import { FlatList } from "react-native";
import { ExerciseCard } from "@components/ExerciseCard";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";


export function Home() {
    const [exercises, setExercises] = useState([
        "Puxada frontal", 
        "Remada curvada", 
        "Remada unilateral", 
        "Levantamento terra",
        "3",
        "4",
        "5"
    ])
    const [groups, setGroups] = useState(["Costas", "Bíceps", "Tríceps", "Ombro"])
    const [groupSelected, setGroupSelected] = useState("costas")

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails(){
        navigation.navigate("exercise")
    }
    
    return (
        <VStack flex={1}>
            <HomeHeader/>

            <FlatList 
                data={groups}
                keyExtractor={(item) => item}
                renderItem={({ item }) => ( 
                    <Group 
                        name={item} 
                        isActive={groupSelected.toLocaleLowerCase() === item.toLocaleLowerCase()} 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{ marginVertical: 20, maxHeight: 44, minHeight: 44 }}
            />

            <VStack px="$8" flex={1}>
                <HStack 
                    justifyContent="space-between" 
                    mb="$5" 
                    alignItems="center"
                >
                    <Heading 
                        color="$gray200" 
                        fontSize="$md" 
                        fontFamily="$heading"
                    >
                        Exercícios
                    </Heading>

                    <Text 
                        color="$gray200" 
                        fontSize="$sm" 
                        fontFamily="$body"
                    >
                        {exercises.length}
                    </Text>
                </HStack>

                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => <ExerciseCard onPress={handleOpenExerciseDetails} name={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>
            
        </VStack>
    )
}