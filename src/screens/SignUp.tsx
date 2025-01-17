import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";

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

  

  const { control, handleSubmit, formState:{ errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  function handleGoBack() {
    navigation.goBack();
  }

  function handleSignUp(data: FormDataProps) {
    console.log(data);
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
                <Center my="$24">
                    <Logo />

                    <Text color="$gray100" fontSize="$sm">
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center gap="$2" flex={1}>
                    <Heading color="$gray100">Cries sua conta</Heading>

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
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
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
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
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