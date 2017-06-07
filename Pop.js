import React, {Component}from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableHighlight,
    Animated,
    Platform,
    BackAndroid
} from 'react-native'
// import {Actions} from 'react-native-nightfarmer-router'
// import {Actions} from '../router'
import handler from './AppRegistryInjection'

class Comp extends Component {
    info = this.props.alertBean.info;
    maskOpacity = new Animated.Value(0);
    cardOpacity = new Animated.Value(0);
    cardScale = new Animated.Value(1.2);

    constructor(props) {
        super(props);
        this.props.alertBean.dismiss = this.dismissWithAnim
    }

    render() {
        return (
            <Animated.View style={[styles.mask, {opacity: this.maskOpacity}]}>
                <Animated.View
                    style={[styles.cardView, {opacity: this.cardOpacity, transform: [{scale: this.cardScale}]}]}>
                    {this.info.content}
                </Animated.View>
            </Animated.View>
        )
    }

    runInitAnim = () => {
        Animated.timing(
            this.maskOpacity,
            {
                toValue: 1,
                duration: 250
            },
        ).start();
        Animated.timing(
            this.cardOpacity,
            {
                toValue: 1,
                duration: 250
            },
        ).start();
        Animated.timing(
            this.cardScale,
            {
                toValue: 1,
                duration: 250
            },
        ).start();
    };

    dismissWithAnim = () => {
        if (this.props.alertBean.info.dismissCallback) {
            this.props.alertBean.info.dismissCallback()
        }
        Animated.timing(
            this.maskOpacity,
            {
                toValue: 0,
                duration: 250
            },
        ).start();
        Animated.timing(
            this.cardOpacity,
            {
                toValue: 0,
                duration: 250
            },
        ).start();
        Animated.timing(
            this.cardScale,
            {
                toValue: 0.8,
                duration: 250
            },
        ).start(() => {
            this.props.alertBean.dismissInvokeHandler();
        });
    };

    handlerCallBack = () => {
        this.dismissWithAnim();
        return true
    };

    componentDidMount() {
        if (this.props.alertBean.dismissed) {
            this.dismissWithAnim()
        } else {
            this.runInitAnim()
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.handlerCallBack);
        }
    }
}

class Pop {
    dismissInvokeHandler = null;
    info = null;
    dismissed = false;

    insert = () => {
        handler.insertModule(<Comp alertBean={this}
                                   dismissCallback={(callBack) => this.dismissInvokeHandler = callBack}/>)
    };

    dismiss = () => {
        this.dismissed = true;
    };

    static show(alertInfo) {
        let instance = new Pop();
        instance.info = alertInfo;
        instance.insert();
        return instance;
    }
}

class PopInfo {
    dismissCallback = null
    content = undefined
}


const styles = StyleSheet.create({
    mask: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0003"
    },
    cardView: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        width: "80%",
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
        paddingTop: 20,
        paddingBottom: 10
    },
    message: {
        fontSize: 14,
        color: "#555",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: 8,
        marginTop: 0,
        marginBottom: 10
    },
    buttonLayout: {
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#DDD",
        height: 45,
        alignSelf: "stretch"
    },
    buttonSplit: {
        width: StyleSheet.hairlineWidth,
        height: "100%",
        backgroundColor: "#DDD"
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 15,
        color: "#037BFF",
    }

});

export default Pop;