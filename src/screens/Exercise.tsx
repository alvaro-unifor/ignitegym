import { VStack, Icon, HStack, Text, Image, Box } from "@gluestack-ui/themed";
import { TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

import { Heading } from "@gluestack-ui/themed";
import { Button } from "@components/Button";

type RouteParamsProps = {
    exerciseId: string;
}

export function Exercise() {

    const route = useRoute();

    const { exerciseId } = route.params as RouteParamsProps;

    console.log(exerciseId);

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    function handleGoBack() {
        navigation.goBack()
    }
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
                        Puxada frontal
                    </Heading>

                    <HStack alignContent="center">
                        <BodySvg />
                        <Text color="$gray200" ml="$1" textTransform="capitalize">
                            Costas
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 16}}>
                <VStack p="$8">
                    <Image 
                        source={{ uri: "https://i.pinimg.com/1200x/d2/d1/b9/d2d1b909de614adc225cee23ea05578b.jpg" }}
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
                            <Text color="$gray200" ml="$2">3 séries</Text>
                        </HStack> 

                        <HStack>
                            <RepetitionSvg />
                            <Text color="$gray200" ml="$2">12 repetições</Text>
                        </HStack> 
                        </HStack>

                        <Button 
                            title="Marcar como finalizado"
                        />
                    </Box>
                </VStack>
            </ScrollView>
        </VStack>
    )
}