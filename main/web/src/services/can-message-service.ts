interface ICanMessageService {
  transformMessage: (data: ArrayBuffer) => ICanMessage;
}

export interface ICanMessage {
  identifier: number;
  dataLengthCode: number;
  data: number[];
  timestamp: Date;
}

export const canMessageService: ICanMessageService = {
  transformMessage: (data: ArrayBuffer) => {
    const buff = new Uint8Array(data);

    const dlc = buff[4];

    const canMsg: ICanMessage = {
      timestamp: new Date(),
      identifier: buff[0] | (buff[1] << 8) | (buff[2] << 16) | (buff[3] << 24),
      dataLengthCode: dlc,
      data: (() => {
        const result = new Array(dlc);
        for (let i = 0; i < dlc; i++) {
          result[i] = buff[5 + i];
        }
        return result;
      })(),
    };

    return canMsg;
  },
};
