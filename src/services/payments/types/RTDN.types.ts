export enum SubscriptionNotificationType {
  SUBSCRIPTION_RECOVERED = 1, // Assinatura recuperada da suspensão de conta
  SUBSCRIPTION_RENEWED = 2, // Renovação bem-sucedida
  SUBSCRIPTION_CANCELED = 3, // Cancelamento voluntário ou involuntário
  SUBSCRIPTION_PURCHASED = 4, // Nova assinatura comprada
  SUBSCRIPTION_ON_HOLD = 5, // Assinatura suspensa por falha no pagamento
  SUBSCRIPTION_IN_GRACE_PERIOD = 6, // Assinatura entrou no período de carência
  SUBSCRIPTION_RESTARTED = 7, // Usuário reativou a assinatura antes da expiração
  SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8, // Mudança de preço confirmada
  SUBSCRIPTION_DEFERRED = 9, // Tempo de renovação adiado
  SUBSCRIPTION_PAUSED = 10, // Assinatura pausada
  SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11, // Alteração no cronograma de pausa
  SUBSCRIPTION_REVOKED = 12, // Assinatura revogada pelo usuário antes do vencimento
  SUBSCRIPTION_EXPIRED = 13, // Assinatura expirada
  SUBSCRIPTION_PENDING_PURCHASE_CANCELED = 20, // Compra pendente cancelada
}

export interface SubscriptionNotification {
  version: string;
  notificationType: SubscriptionNotificationType;
  purchaseToken: string;
  subscriptionId: string;
}

export enum OneTimeProductNotificationType {
  ONE_TIME_PRODUCT_PURCHASED = 1,
  ONE_TIME_PRODUCT_CANCELED = 2,
}

export interface OneTimeProductNotification {
  version: string;
  notificationType: OneTimeProductNotificationType;
  purchaseToken: string;
  sku: string; // ID do produto comprado
}

// Enum para os tipos de notificações de compras anuladas (reembolsos ou cancelamentos)
export enum VoidedPurchaseProductType {
  PRODUCT_TYPE_SUBSCRIPTION = 1, // Assinatura anulada
  PRODUCT_TYPE_ONE_TIME = 2, // Compra única anulada
}

// Enum para os tipos de reembolso
export enum VoidedPurchaseRefundType {
  REFUND_TYPE_FULL_REFUND = 1, // Reembolso completo
  REFUND_TYPE_QUANTITY_BASED_PARTIAL_REFUND = 2, // Reembolso parcial baseado em quantidade
}

// Estrutura para notificações de compras anuladas
export interface VoidedPurchaseNotification {
  purchaseToken: string;
  orderId: string;
  productType: VoidedPurchaseProductType;
  refundType?: VoidedPurchaseRefundType;
}

export interface TestNotification {
  version: string;
}

// Estrutura principal da notificação RTDN
export interface RealTimeDeveloperNotification {
  version: string;
  packageName: string;
  eventTimeMillis: string;
  subscriptionNotification?: SubscriptionNotification;
  oneTimeProductNotification?: OneTimeProductNotification;
  voidedPurchaseNotification?: VoidedPurchaseNotification;
  testNotification?: TestNotification;
}
