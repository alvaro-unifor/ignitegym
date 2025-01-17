import { useState } from "react";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Input } from "@components/input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
    const [userPhoto, setUserPhoto] = useState("https:github.com/arthurbrit0.png");

    const toast = useToast();

    async function handleUserPhotoSelect() {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        })

        if(photoSelected.canceled) {
            return;
        }

        const photoURI = photoSelected.assets[0].uri

        if(photoURI) {
            const photoInfo = await FileSystem.getInfoAsync(photoURI) as { size: number }

            if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage 
                            id={id}
                            title="Essa imagem é muito grande. Escolha uma de até 5MB" 
                            action = "error" 
                            onClose={() => toast.close(id)}
                        />
                    )
                })
            }

            setUserPhoto(photoURI) 
        }

    }
    
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto 
                        source={{ uri: userPhoto}}
                        alt="Foto de perfil"
                        size="xl"
                    />

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text 
                            color="$green500"
                            fontFamily="$heading"
                            fontSize="$md"
                            mt="$2"
                            mb="$8"
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    <Center w="$full" gap="$4">
                        <Input placeholder="Nome" bg="$gray600"/>
                        <Input value="alvaro.a.bezera@gmail.com" bg="$gray600" isReadOnly/>
                    </Center> 

                    <Heading 
                        alignSelf="flex-start"
                        fontFamily="$heading"
                        color="$gray200"
                        fontSize="$md"
                        mt="$12" 
                        mb="$2"
                    >
                        Alterar senha
                    </Heading> 

                    <Center w="$full" gap="$4">
                        <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
                        <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
                        <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />

                        <Button title="Atualizar"/>
                    </Center>                 
                </Center>
            </ScrollView>
        </VStack>
    )
}