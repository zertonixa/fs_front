import { useAdminHistory } from "@/entities/adminHistory/api";
import styles from "./adminHistory.module.scss";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import { AdminStoryCard } from "@/entities/adminHistory/ui";


export const AdminHistory = () => {

    const history = useAdminHistory();

    return(
        <div className={styles.container}>
            <div className={styles.containerCards}>
                {history.isPending && <LoadingSpinner/>}
                {history.error && <span>`Ошибка загрузки истории: ${history.error.message}`</span>}
                {history.data && history.data.map((story) =>
                    <AdminStoryCard
                        id={story.id}
                        action={story.action}
                        moderator_id={story.moderator_id}
                        target_user_id={story.target_user_id}
                        created_at={story.created_at}
                        description={story.description}
                        slot_id={story.slot_id}
                    />
                )}
            </div>
        </div>
    )
}