import { GetNotSyncedDataParams, NotSyncedData } from './types';
import { booksService } from '../../services/books';
import { ApiRequestWithQuery, ApiResponse } from '../../interfaces/ApiResponse';
import { bookCollectionsService } from '../../services/bookCollections';
const getNotSyncedData = async (
  req: ApiRequestWithQuery<GetNotSyncedDataParams>,
  res: ApiResponse<NotSyncedData>
) => {
  const { lastSync } = req.query;

  try {
    lastSync && new Date(lastSync);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'lastSync must be a valid date string',
      error,
    });
  }

  const currentDate = new Date().toISOString();

  const { books } = await booksService.listNotSynced({ lastSync });
  const { bookCollections } = await bookCollectionsService.listNotSynced({
    lastSync,
  });

  return res.status(200).json({
    success: true,
    lastSync: currentDate,
    books,
    bookCollections,
  });
};

export const syncController = {
  getNotSyncedData,
};
