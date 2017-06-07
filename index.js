/**
 * Created by zhangfan on 17-4-12.
 */
import Alert from './Alert'
import Pop from './Pop'
class Dialog {

    alert = Alert.alert
    pop = Pop.show
}

export default new Dialog()