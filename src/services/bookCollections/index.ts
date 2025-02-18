import { BookCollectionModel } from '../../models/bookCollection';
import {
  CreateBookCollectionParams,
  ListNotSyncedParams,
  ListNotSyncedReturn,
} from './types';

const create = async ({
  name,
  books,
}: CreateBookCollectionParams): Promise<{ id: string }> => {
  const response = await BookCollectionModel.create({
    name,
    books,
  });

  return {
    id: response.id,
  };
};

const listNotSynced = async ({
  lastSync,
}: ListNotSyncedParams): Promise<ListNotSyncedReturn> => {
  const bookCollections = await BookCollectionModel.find(
    lastSync
      ? {
          updatedAt: {
            $gte: new Date(lastSync),
          },
        }
      : {}
  );

  return { bookCollections };
};

export const bookCollectionsService = {
  create,
  listNotSynced,
};
