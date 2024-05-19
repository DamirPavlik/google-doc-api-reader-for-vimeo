import { useContext } from "react";
import StatusContext from "../context/statusProvider";

const statusDisplay = () => {
    const { status } = useContext(StatusContext);
    return <p>Status: {status}</p>;
};

export default statusDisplay 