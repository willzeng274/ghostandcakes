import React from "react"

export default function Refresh() {
    React.useEffect(() => {
        window.location.href = "/game";
    }, []);
    return (
        <>
        </>
    )
}