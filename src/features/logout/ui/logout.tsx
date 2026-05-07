import { useNavigate } from "react-router-dom";
import { useLogout } from "../api";
import styles from "./logout.module.scss";
import logout from "@shared/assets/enter.webp";


export const Logout = () => {

    const out = useLogout();
    const navigate = useNavigate();

    const handleClick = () => {
        out.mutate({}, {onSuccess: () => navigate("/login")})
    }

    return(
        <button type="button" className={styles.container} onClick={handleClick}>
            <img src={logout} className={styles.containerButton}/>
        </button>
    )
}