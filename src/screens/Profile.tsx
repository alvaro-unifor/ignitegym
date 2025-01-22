import { useState } from "react";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Input } from "@components/input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defaltUserPhotoImg from "@assets/userPhotoDefault.png";


type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required("Nome é obrigatório"),
    password: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres").nullable().transform((value) => !!value ? value : null),
    confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'As senhas não conferem')
    .when('password', {
        is: (Field: any) => Field,
        then: (schema) => schema
            .nullable()
            .required('Informe a confirmação da senha')
            .transform((value) => !!value ? value : null)
    })
});

export function Profile() {
    const [isUpdataing, setIsUpdating] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState:{errors} } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            console.log(data);
            await api.put('/users', data);

            await updateUserProfile(userUpdated);
            
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id}
                        title= "perfil atualizado com sucesso"
                        action = "success" 
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possivel atualizar o perfil"
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
            setIsUpdating(false);
        }
        console.log(data);
    }

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
            console.log(photoSelected.assets[0].uri);
            const fileExtension = photoSelected.assets[0].uri.split('.').pop();
            const photoFile = {
                name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
                uri: photoSelected.assets[0].uri,
                type: `${photoSelected.assets[0].type}/${fileExtension}`
            } as any;

            const userPhotoUploadForm = new FormData();
            userPhotoUploadForm.append('avatar', photoFile);

            const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const userUpdated = user;
            userUpdated.avatar = avatarUpdatedResponse.data.avatar;
            updateUserProfile(userUpdated);
            console.log(user);
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id}
                        title="Foto ataualizada!" 
                        action = "success" 
                        onClose={() => toast.close(id)}
                    />
                )
            })
        }

    }
    
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto 
                        source={user.avatar? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaltUserPhotoImg}
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
                        <Controller 
                            control={control}
                            name="name"
                            render={({ field: { onChange, value }}) => (
                                <Input
                                    bg="$gray600"
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="email"
                            render={({ field: { onChange, value }}) => (
                                <Input
                                    bg="$gray600"
                                    placeholder="Email"
                                    onChangeText={onChange}
                                    isReadOnly
                                    value={value}
                                />
                            )}
                        />
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

                        <Controller 
                            control={control}
                            name="old_password"
                            render={({ field: { onChange }}) => (
                                <Input 
                                    placeholder="Senha antiga" 
                                    bg="$gray600" 
                                    secureTextEntry 
                                    autoComplete="off"
                                    textContentType="none"
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="password"
                            render={({ field: { onChange }}) => (
                                <Input 
                                    placeholder="Nova senha" 
                                    bg="$gray600" 
                                    secureTextEntry 
                                    autoComplete="off"
                                    textContentType="none"
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange }}) => (
                                <Input 
                                    placeholder="Confirme a nova senha" 
                                    bg="$gray600" 
                                    secureTextEntry 
                                    autoComplete="off"
                                    textContentType="none"
                                    onChangeText={onChange}
                                    errorMessage={errors.confirm_password?.message}
                                />
                            )}
                        />
                        
                        <Button 
                            title="Atualizar"
                            onPress={handleSubmit(handleProfileUpdate)}
                            isLoading={isUpdataing}
                        />
                    </Center>                 
                </Center>
            </ScrollView>
        </VStack>
    )
}