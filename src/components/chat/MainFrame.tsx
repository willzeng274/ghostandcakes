import { useState, useEffect } from "react";
import { useColorMode, Button } from "@chakra-ui/react";

const MainFrame = ({ children }: { children: any[] }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <>
            <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                {...children}
            </Button>
        </>
    )
}

export default MainFrame;