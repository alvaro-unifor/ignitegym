import { VStack, Text, HStack, Heading, useToast } from "@gluestack-ui/themed";
import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ExerciseCard } from "@components/ExerciseCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const [groups, setGroups] = useState<string[]>([""])
    const [groupSelected, setGroupSelected] = useState<string>(groups ? groups[0] : "")

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const toast = useToast();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate("exercise", { exerciseId })
    }

    async function fetchGroups() {
        try {
            const response = await api.get("/groups")
            setGroups(response.data)
            setGroupSelected(response.data[0])
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possivel carregar os grupos"
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id}
                        title= {title}
                        action = "error" 
                        onClose={() => toast.close(id)}
                    />
                )
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/bygroup/${groupSelected}`)
            setExercises(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possivel carregar os exercícios"
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id}
                        title= {title}
                        action = "error" 
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]))
    
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

            {
                isLoading ? <Loading /> :

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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ExerciseCard onPress={() => handleOpenExerciseDetails(item.id)} data={item}/>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>
            }
        </VStack>
    )
}