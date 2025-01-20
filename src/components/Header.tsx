import { Center, Text } from "@gluestack-ui/themed";
import Logo from "@assets/logo.svg";

export function Header() {
    return(
        <Center my="$24">
            <Logo />
                <Text color="$gray100" fontSize="$sm">
                    Treine sua mente e o seu corpo
                </Text>
        </Center>
    )
}