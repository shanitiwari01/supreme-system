import React, { useState } from "react";
import { View } from 'react-native';
import { Button, Dialog, Portal, Provider } from 'react-native-paper';

/**
 * Common LHDialog component
 * @param {*} props 
 * @returns Header 
 */
// DeleteStudentAsync(studentID)
export const LHDialog = (props: any) => {
    return (
        <>
            <Provider>
                    <Portal >
                        <Dialog visible={props.visible} onDismiss={()=>props.hideDialog()} style={{ width: '60%', alignSelf: 'center' }}>
                            <Dialog.Title>{props.messageText}</Dialog.Title>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Dialog.Actions>
                                    <Button onPress={()=>props.hideDialog()}>{props.negativeText}</Button>
                                </Dialog.Actions>
                                <Dialog.Actions>
                                    <Button onPress={() => props.onPostiveCallback()}>{props.positiveText}</Button>
                                </Dialog.Actions>
                            </View>
                        </Dialog>
                    </Portal>
                </Provider>
        </>
    );
}
