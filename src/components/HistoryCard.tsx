import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

type HistoryCardProps = {
    data: HistoryDTO;
}

export function HistoryCard({data, ...rest}: HistoryCardProps) {
    return (
        <HStack 
            w="$full"
            px="$5"
            py="$4"
            mb="$3"
            bg="$gray600"
            rounded="$md"
            justifyContent="space-between"
            alignItems="center"
            {...rest}
        >
            <VStack flex={1} mr="$5">
                <Heading
                    color="$white"
                    fontSize="$md"
                    textTransform="capitalize"
                    fontFamily="$heading"
                    numberOfLines={1}
                >
                    {data.group}
                </Heading>

                <Text
                   color="$gray100" fontSize="$lg" 
                >
                    {data.name}
                </Text>
            </VStack>

            <Text
                color="$gray300"
                fontSize="$md"    
            >
                {data.hour}
            </Text>

        </HStack>
    )
}