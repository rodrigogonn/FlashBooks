import { z } from 'zod';

export const verifyPurchaseSchema = z.object({
  purchaseToken: z.string().min(1, { message: 'Purchase token is required.' }),
  packageName: z.string().min(1, { message: 'Package name is required.' }),
  productId: z.string().min(1, { message: 'Subscription ID is required.' }),
});
