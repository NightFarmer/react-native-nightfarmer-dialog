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
import {Actions} from 'react-native-nightfarmer-router'
// import {Actions} from '../router'


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
                    <Text style={styles.title}>{this.info.title}</Text>
                    <Text style={styles.message}>{this.info.message}</Text>
                    <View style={styles.buttonLayout}>
                        {this.renderButtons()}
                    </View>
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

    renderButtons = () => {
        let views = [];
        if (!this.info.buttonList || this.info.buttonList.length == 0) {
            this.info.buttonList = [{
                label: "确定"
            }]
        }
        this.info.buttonList.forEach((item, index) => {
            if (index > 0) {
                views.push(<View style={styles.buttonSplit} key={"split-" + index}/>)
            }
            let leftRadius = 0;
            let rightRadius = 0;
            if (index == 0) {
                leftRadius = 8
            }
            if (index == this.info.buttonList.length - 1) {
                rightRadius = 8
            }
            views.push(
                <TouchableHighlight
                    style={[styles.button, {borderBottomLeftRadius: leftRadius, borderBottomRightRadius: rightRadius}]}
                    underlayColor="#0002"
                    onPress={() => {
                        if (item.callback) {
                            item.callback()
                        }
                        this.dismissWithAnim()
                    }}
                    key={"button-" + index}
                >
                    <Text style={styles.buttonText}>{item.label}</Text>
                </TouchableHighlight>
            )
        });
        return views
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

class Alert {
    dismissInvokeHandler = null;
    info = null;
    dismissed = false;

    show = () => {
        Actions.insertModule(<Comp alertBean={this} dismissCallback={(callBack) => this.dismissInvokeHandler = callBack}
        />)
    };

    dismiss = () => {
        this.dismissed = true;
    };

    static alert(alertInfo) {
        let instance = new Alert();
        instance.info = alertInfo;
        instance.show();
        return instance;
    }
}

class AlertInfo {
    title = "";
    message = "";
    buttonList = [];
    dismissCallback = null
}

class ButtonList {
    label = "";
    callback = null
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
        fontSize: 15,
        color: "#333",
        padding: 10
    },
    message: {
        fontSize: 14,
        color: "#555",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: 8,
        marginTop: 10,
        marginBottom: 10
    },
    buttonLayout: {
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#DDD",
        height: 40,
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

export default Alert;