import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native";
type Props = TouchableOpacityProps

export function ExerciseCard({ ...rest }: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack 
                bg="$gray500" 
                alignItems="center" 
                p="$2" 
                pr="$4"
                rounded="$md"
                mb="$3"
            >
                <Image 
                    source={{ uri: "https://i.pinimg.com/1200x/d2/d1/b9/d2d1b909de614adc225cee23ea05578b.jpg" }}
                    alt="Exercício"
                    w="$16"
                    h="$16"
                    mr="$4"
                    rounded="$md"
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading 
                        fontSize="$lg" 
                        color ="$white" 
                        fontFamily="$heading"
                    >
                        Puxada Frontal
                    </Heading>

                    <Text
                        fontSize="$sm"
                        color="$gray200"
                        mt="$1"
                        numberOfLines={2}
                    >
                        3 séries x 12 repetições
                    </Text>
                </VStack>
                <Icon as={ChevronRight} color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}