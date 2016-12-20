import FCM from 'react-native-fcm';

export default {
  presentLocalNotification(notificationType, body, customData) {
    FCM.presentLocalNotification({
      body: body,
      extraData: customData,
      notificationType: notificationType,
      show_in_foreground: true,
    });
  },

  presentLocalChatNotification(userMessage) {
    this.presentLocalNotification(
      'MESSAGE',
      `${userMessage.sender.nickname} : ${userMessage.message}`,
      JSON.stringify({ opponent: { name: userMessage.sender.nickname, userId: userMessage.sender.userId } }),
    );
  },
};
