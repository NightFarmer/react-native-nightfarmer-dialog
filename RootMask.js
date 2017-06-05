/**
 * Created by zhangfan on 17-4-7.
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    StyleSheet,
    Text,
    InteractionManager
} from 'react-native';

class RootMask extends Component {

    render() {
        return (
            <View style={styles.container}>
                {this.state.actView && this.state.actView.component }
            </View>
        )
    }

    state = {
        actView: null
    };

    callQueue = [];


    _pushView = (it) => {
        it.dismissCallback = () => {
            if (this.callQueue.length > 0) {
                let item = this.callQueue.shift();
                this._pushView(item)
            } else {
                this._setActView(null)
            }
        };
        this._setActView(it)
    };

    _setActView = (it) => {
        InteractionManager.runAfterInteractions(() => {//等待没有任何动画和触摸的时候再回调
            this.setState({actView: it});
        })
    };


    // dismiss = (it) => {
    //     it.compRef.dismiss()
    // };


    componentWillMount() {
        this.props.handlerShow(this.show);
    };

    show = (it) => {
        if (this.state.actView) {
            this.callQueue.push(it);
            return
        }
        this._pushView(it);
        return it;
    };
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
    }
});


export default RootMask