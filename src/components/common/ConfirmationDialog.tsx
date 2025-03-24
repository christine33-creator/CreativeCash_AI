import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Text, Button } from 'react-native-elements';

interface ConfirmationDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmationDialog = ({
  isVisible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationDialogProps) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onCancel}
      overlayStyle={styles.overlay}
    >
      <View style={styles.container}>
        <Text h4 style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={cancelText}
            type="outline"
            onPress={onCancel}
            containerStyle={styles.buttonWrapper}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            containerStyle={styles.buttonWrapper}
            buttonStyle={[
              styles.confirmButton,
              isDestructive && styles.destructiveButton,
            ]}
          />
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    borderRadius: 10,
  },
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
  },
  destructiveButton: {
    backgroundColor: '#ff4444',
  },
}); 