/* @flow */
/** @jsx node */
/* eslint max-lines: 0 */

import { getLogger, getPayPalDomainRegex, getSDKMeta, getPayPalDomain, getClientID, getUserAccessToken, getClientAccessToken, getUserAuthCode } from '@paypal/sdk-client/src';
import { create, type ZoidComponent } from 'zoid/src';
import { inlineMemoize, memoize } from 'belter/src';
import { ZalgoPromise } from 'zalgo-promise/src';
import { FUNDING } from '@paypal/sdk-constants/src';

import { type WalletProps } from './props';

export function getWalletComponent() : ZoidComponent<WalletProps> {
    return inlineMemoize(getWalletComponent, () => {
        return create({
            tag:    'paypal-wallet',
            url:    ({ props }) => `${ getPayPalDomain() }${ __PAYPAL_CHECKOUT__.__URI__.__WALLET__ }/${ props.fundingSource }`,
            domain: getPayPalDomainRegex(),
            
            autoResize: {
                width:  false,
                height: true
            },

            dimensions: {
                width:  '100%',
                height: '150px'
            },

            logger: getLogger(),

            prerenderTemplate: () => {
                return null;
            },

            attributes: {
                iframe: {
                    scrolling: 'no'
                }
            },

            props: {
                sdkMeta: {
                    type:        'string',
                    queryParam:  true,
                    sendToChild: false,
                    value:       getSDKMeta
                },
                
                clientID: {
                    type:       'string',
                    queryParam: true,
                    value:      getClientID
                },
                
                clientAccessToken: {
                    type:       'string',
                    required:   false,
                    queryParam: true,
                    value:      getClientAccessToken
                },

                buyerAccessToken: {
                    type:       'string',
                    queryParam: true,
                    value:      getUserAccessToken
                },

                buyerAuthCode: {
                    type:       'string',
                    queryParam: true,
                    value:      getUserAuthCode
                },

                fundingSource: {
                    type:       'string',
                    queryParam: true,
                    def:        () => FUNDING.PAYPAL
                },

                style: {
                    type:     'object',
                    required: false
                },

                setupListeners: {
                    type:     'function',
                    required: false
                },

                createOrder: {
                    type:       'function',
                    queryParam: 'orderID',
                    queryValue: ({ value }) => ZalgoPromise.try(value),
                    decorate:   ({ value }) => memoize(value)
                },

                onApprove: {
                    type: 'function'
                }
            }
        });
    });
}
