import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import BackGroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { useState } from "react";

import { Input } from "@components/input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes"; 

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastMessage } from "@components/ToastMessage";
import { api } from "@services/api";
import axios from "axios";
import { AppError } from "@utils/AppError";
import { Header } from "@components/Header";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required("Informe o nome"),
    email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
    password: yup.string().required("Informe a senha").min(6, "A senha deve ter no mínimo 6 caracteres"),
    password_confirm: yup.string().required("Confirme a senha").oneOf([yup.ref('password'), ''], 'As senhas não conferem')
});

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  
  const { control, handleSubmit, formState:{ errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  function handleGoBack() {
    navigation.goBack();
  };

  async function handleSignUp({name, email, password}: FormDataProps) {
    try {
        const response = await api.post("/users", { name, email, password })
        console.log(response.data);
        toast.show({
            placement: "top",
            render: ({ id }) => (
                <ToastMessage 
                    id={id}
                    title= "Usuário criado com sucesso!"
                    action = "success" 
                    onClose={() => toast.close(id)}
                />
            )
        })
        handleGoBack();
    } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Não foi pssivel criar a conta. Tente novamente mais tarde";
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

                <Center gap="$2" flex={1}>
                    <Heading color="$gray100">Crie sua conta</Heading>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
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
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="E-mail" 
                                keyboardType="email-address" 
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}

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
                                autoComplete="new-password"
                                toggleShowPassword={toggleShowPassword}
                                showPassword={showPassword}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />


                    <Controller
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Confirmar senha"
                                secureTextEntry={!showConfirmPassword}
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                isPasswordInput = {true}
                                toggleShowPassword={toggleShowConfirmPassword}
                                showPassword={showConfirmPassword}
                                autoComplete="new-password"
                                returnKeyType="send"
                                errorMessage={errors.password_confirm?.message}

                            />
                        )}
                    />
                    
                    <Button 
                        title="Criar e acessar" 
                        onPress={handleSubmit(handleSignUp)}/>
                </Center>

                <Button 
                    title="Voltar para o login" 
                    variant = "outline" 
                    mt="$12" 
                    onPress={handleGoBack}
                />
            </VStack>
        </VStack>
    </ScrollView>
  );
}