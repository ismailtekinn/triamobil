import TcpSocket from 'react-native-tcp-socket';

export const sendToPrinter = (
  printerIp: string,
  printerPort: number,
  data: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection(
      {
        host: printerIp,
        port: printerPort,
      },
      () => {
        console.log('Printer connected!');
        client.write(data);
        client.destroy();
        resolve('Sent!');
      }
    );

    client.on('error', (error: any) => {
      console.log('Printer connection error:', error);
      reject(error);
    });

    client.on('close', () => {
      console.log('Printer connection closed');
    });
  });
};
