import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";

import BackGroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { useState } from "react";

import { Input } from "@components/input";
import { Button } from "@components/Button";

import { Controller, useForm } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes"; 

import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { Header } from "@components/Header";


type FormData = {
    email: string;
    password: string;
}

export function Signin() {
  const { signIn } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  }

  async function handleSignIn({email, password}: FormData) {
    try{
        setIsLoading(true);
        await signIn(email, password);
    } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Erro ao realizar login";
        setIsLoading(false);

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

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  return (
    <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <VStack flex={1}>
            <Image
                w="$full"
                h={624}
                source={BackGroundImg}
                defaultSource={BackGroundImg}
                alt="Pessoa treinando"
                position="absolute"
            />
            
            <VStack flex={1} px="$10" pb="$16">
                
                <Header />

                <Center gap="$2">
                    <Heading color="$gray100">Acesse sua conta</Heading>

                    <Controller 
                        control={control}
                        name="email"
                        rules={{ required: "Campo obrigatório" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                errorMessage={errors.email?.message}
                                value={value}
                            />
                        )}
                    />
                    
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Senha"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                isPasswordInput = {true}
                                autoComplete="off"
                                toggleShowPassword={toggleShowPassword}
                                showPassword={showPassword}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    
                    <Button 
                        title="Acessar"
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />
                </Center>

                <Center flex={1} justifyContent="flex-end" mt="$4">
                    <Text color="$gray100" fontSize="$sm" mb="$3">
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                        title="Criar Conta" 
                        variant="outline" 
                        onPress={handleNewAccount}
                    />
                </Center>
            </VStack>
        </VStack>
    </ScrollView>
  );
}