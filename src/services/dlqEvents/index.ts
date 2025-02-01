import { DlqEventModel } from '../../models/dlqEvents';
import { CreateDlqEventParams } from './types';

const create = async ({ topicName, message }: CreateDlqEventParams) => {
  const response = await DlqEventModel.create({ topicName, message });

  return {
    id: response.id,
  };
};

export const dlqEventsService = {
  create,
};
