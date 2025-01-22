import { VStack, Icon, HStack, Text, Image, Box, useToast } from "@gluestack-ui/themed";
import { TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

import { Heading } from "@gluestack-ui/themed";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { useEffect, useState } from "react";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
    exerciseId: string;
}

export function Exercise() {
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
    const [sendingRegister, setSendingRegister] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const route = useRoute();
    const toast = useToast();
    const { exerciseId } = route.params as RouteParamsProps;

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack() {
        navigation.goBack()
    }

    async function hanldeExerciseHistoryRegister() {
        try {
            setSendingRegister(true);
            const response = await api.post(`/history`, { exercise_id: exerciseId });
            console.log(response.data);
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id}
                        title= "Parabens! Exercício registrado com sucesso"
                        action = "success" 
                        onClose={() => toast.close(id)}
                    />
                )
            })

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possivel registrar o exercício"
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
            setSendingRegister(false);
        }
    }

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/${exerciseId}`);
            setExercise(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possivel carregar o exercício"
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
        fetchExerciseDetails();
    }, [exerciseId])

    return (
        <VStack flex={1}>
            <VStack px="$8" pt="$8" bg="$gray600">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl"/>
                </TouchableOpacity>


                <HStack 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mt="$4" 
                    pb="$4"
                >
                    <Heading 
                        color="$gray100"
                        fontFamily="$heading"
                        fontSize="$lg"
                        flexShrink={1}
                    >
                        {exercise.name}
                    </Heading>

                    <HStack alignContent="center">
                        <BodySvg />
                        <Text color="$gray200" ml="$1" textTransform="capitalize">
                            {exercise.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            { isLoading ? <Loading  /> :
            
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 16}}>
                <VStack p="$8">
                    <Image 
                        source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                        alt="Exercício"
                        mb="$3"
                        resizeMode="cover"
                        rounded="$lg"
                        w="$full"
                        h="$80"
                    />

                    <Box bg="$gray600" rounded="$md" pb="$4" px="$4" mb="$5">
                        <HStack alignItems="center" justifyContent="space-around" mt="$5" mb="$6">
                        <HStack>
                            <SeriesSvg />
                            <Text color="$gray200" ml="$2">{exercise.series} séries</Text>
                        </HStack> 

                        <HStack>
                            <RepetitionSvg />
                            <Text color="$gray200" ml="$2">{exercise.repetitions} repetições</Text>
                        </HStack> 
                        </HStack>

                        <Button 
                            title="Marcar como finalizado"
                            isLoading={sendingRegister}
                            onPress={hanldeExerciseHistoryRegister}
                        />
                    </Box>
                </VStack>
            </ScrollView>
            }
        </VStack>
    )
}