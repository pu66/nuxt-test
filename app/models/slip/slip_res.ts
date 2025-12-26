export interface SlipPostResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    transRef: string;
    sendingBank: string;
    receivingBank: string;
    transDate: string;
    transTime: string;
    transTimestamp: string;
    sender: {
      displayName: string;
      name: string;
      account: {
        type: string;
        value: string;
      };
    };
    receiver: {
      displayName: string;
      name: string;
      proxy: {
        type: string | null;
        value: string | null;
      };
    };
    amount: number;
    qrcodeData: string;
  };
}
