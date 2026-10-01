type Messages = typeof import('../messages/ar.json');

// Gives every `t('…')` call compile-time key checking against the Arabic master file.
declare interface IntlMessages extends Messages {}
