import { InputSlot } from "@gluestack-ui/themed";
import { InputIcon } from "@gluestack-ui/themed";
import { Input as GlueStackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed";
import { ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react-native"


type Props = ComponentProps<typeof InputField> & {
    errorMessage?: string | null;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isPasswordInput?: boolean;
    showPassword?: boolean;
    isAutoComplete?: string;
    toggleShowPassword?: () => void;
}

export function Input({ 
        isReadOnly = false, 
        errorMessage=null, 
        isInvalid=false, 
        isPasswordInput = false,
        showPassword = false,
        isAutoComplete = "",
        toggleShowPassword,
        ...rest 
    }: Props) {
    const invalid = !!errorMessage || isInvalid
    return (
        <FormControl isInvalid={invalid} w="$full" mb="$1">
            <GlueStackInput
                isInvalid={invalid}
                h="$14" 
                borderWidth="$0" 
                borderRadius="$md"
                $focus={{
                    borderWidth: 1,
                    borderColor: invalid ? "$red500" : "$green500",
                }}
                $invalid={{
                    borderWidth: 1,
                    borderColor: "$red500",
                }}
                isReadOnly={isReadOnly}
                opacity={isReadOnly ? 0.5 : 1}
                bg="$gray700"
            >
                <InputField
                    px="$4" 
                    color="$white"
                    fontFamily="$body"
                    placeholderTextColor="$gray300"
                    {...rest}
                />

                {
                    isPasswordInput ? <InputSlot pr="$3" onPress={toggleShowPassword}>
                                        <InputIcon as={showPassword ? Eye : EyeOff} size="md" />
                                      </InputSlot> : null
                }
            </GlueStackInput>
            <FormControlError>
                <FormControlErrorText color="$red500">
                    {errorMessage}
                </FormControlErrorText>
            </FormControlError>
        </FormControl>
    )
}