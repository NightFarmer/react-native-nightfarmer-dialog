import React, {Component} from 'react';
import {StyleSheet, View, AppRegistry, InteractionManager} from 'react-native';
// import StaticContainer from 'react-native/Libraries/Components/StaticContainer';
// import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';

import RootMask from './RootMask'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    }
});

const handler = {};

const originRegister = AppRegistry.registerComponent;

AppRegistry.registerComponent = function (appKey, getAppComponent) {

    return originRegister(appKey, function () {
        const OriginAppComponent = getAppComponent();

        return class extends Component {

            render() {
                return (
                    <View style={styles.container}>
                        <OriginAppComponent {...this.props} />
                        <RootMask handlerInsertModule={(it)=>handler.insertModule=it}/>
                    </View>
                );
            };
        };
    });
};

export default handler;
