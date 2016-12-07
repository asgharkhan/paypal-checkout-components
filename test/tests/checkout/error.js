

import paypal from 'src/index';

import { generateECToken } from '../common';

for (let flow of [ 'popup', 'lightbox' ]) {

    describe(`paypal checkout component error cases on ${flow}`, () => {

        beforeEach(() => {
            paypal.Checkout.contexts.lightbox = (flow === 'lightbox');
        });

        afterEach(() => {
            paypal.Checkout.contexts.lightbox = false;
        });

        it('should render checkout, then fall back and complete the payment', (done) => {

            return paypal.Checkout.render({

                testAction: 'fallback',

                payment() {
                    return generateECToken();
                },

                onAuthorize() {
                    return done();
                },

                onCancel() {
                    return done(new Error('Expected onCancel to not be called'));
                }

            });
        });

        it('should render checkout, then error out', (done) => {

            return paypal.Checkout.render({

                testAction: 'error',

                payment() {
                    return generateECToken();
                },

                onError(err) {
                    assert.ok(err instanceof Error);
                    return done();
                },

                onAuthorize() {
                    return done(new Error('Expected onCancel to not be called'));
                },

                onCancel() {
                    return done(new Error('Expected onCancel to not be called'));
                }

            });
        });
    });
}