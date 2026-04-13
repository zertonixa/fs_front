import { useState } from "react";
import styles from "./reportPopup.module.scss";
import ReportIcon from "@shared/assets/report.svg?react";
import { Menu } from "./menu";


export const Report = () => {

    const [menu, setMenu] = useState<boolean>(false);

    const handleOpen = () => {
        setMenu(true);
    }

    return(
        <>
        <button className={styles.container} onClick={handleOpen}>
            <ReportIcon className={styles.containerIcon}/>
        </button>
        {menu && <Menu close={() => setMenu(false)}/>}
        </>
    )
}