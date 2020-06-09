const ow = require('ow');
const ActorClient = require('./resource_clients/actor');
const ActorCollectionClient = require('./resource_clients/actor_collection');
const BuildClient = require('./resource_clients/build');
// const BuildCollectionClient = require('./resource_clients/build_collection');

// const RunCollectionClient = require('./resource_clients/run_collection');
const RunClient = require('./resource_clients/run');


const { REQUEST_ENDPOINTS_EXP_BACKOFF_MAX_REPEATS, RequestQueues } = require('./request_queues');
const { HttpClient, EXP_BACKOFF_MAX_REPEATS } = require('./http-client');

class Statistics {
    constructor() {
        // Number of Apify client function calls
        this.calls = 0;
        // Number of Apify API requests
        this.requests = 0;
        // Number of times the API returned 429 error. Spread based on number of retries.
        this.rateLimitErrors = new Array(Math.max(REQUEST_ENDPOINTS_EXP_BACKOFF_MAX_REPEATS, EXP_BACKOFF_MAX_REPEATS)).fill(0);
    }
}

/**
 * @type package
 * @class ApifyClient
 * @param {Object} [options] - Global options for ApifyClient. You can globally configure here any method option from any namespace. For example
 *                             if you are working with just one actor then you can preset it's actId here instead of passing it to each
 *                             actor's method.
 * @param {String} [options.userId] - Your user ID at apify.com
 * @param {String} [options.token] - Your API token at apify.com
 * @param {Number} [options.expBackoffMillis=500] - Wait time in milliseconds before repeating request to Apify API in a case of server
 or rate limit error
 * @param {Number} [options.expBackoffMaxRepeats=8] - Maximum number of repeats in a case of error
 * @param {Array<Number>} [options.retryOnStatusCodes=[429]] - An array of status codes on which request gets retried. By default requests are retried
 *                                                             only in a case of limit error (status code 429).
 * @description Basic usage of ApifyClient:
 * ```javascript
 * const ApifyClient = require('apify-client');
 *
 * const apifyClient = new ApifyClient({
 *   userId: 'jklnDMNKLekk',
 *   token: 'SNjkeiuoeD443lpod68dk',
 * });
 * ```
 *
 * All API calls done through this client are made with exponential backoff.
 * What this means, is that if the API call fails, this client will attempt the call again with a small delay.
 * If it fails again, it will do another attempt after twice as long and so on, until one attempt succeeds
 * or 8th attempt fails.
 */
class ApifyClient {
    constructor(options = {}) {
        ow(options, ow.object.exactShape({
            baseUrl: ow.optional.string,
            maxRetries: ow.optional.number,
            token: ow.optional.string,
        }));

        const {
            baseUrl = 'https://api.apify.com/v2',
            maxRetries = 8,
            token,
        } = options;

        /**
         * An object that contains various statistics about the API operations.
         * @memberof ApifyClient
         * @instance
         */
        this.baseUrl = baseUrl;
        this.maxRetries = maxRetries;
        this.token = token;

        this.stats = new Statistics();
        this.httpClient = new HttpClient({
            apifyClientStats: this.stats,
            expBackoffMaxRepeats: this.maxRetries,
        });
    }

    _options() {
        return {
            baseUrl: this.baseUrl,
            httpClient: this.httpClient,
            params: {
                token: this.token,
            },
        };
    }

    actors() {
        return new ActorCollectionClient(this._options());
    }

    actor(id) {
        ow(id, ow.string);
        return new ActorClient({
            id,
            ...this._options(),
        });
    }

    // TODO requires new endpoint
    // builds() {
    //     return new BuildCollectionClient(this._options());
    // }

    // TODO temporarily uses second parameter + nested client
    build(id, actorId) {
        ow(id, ow.string);
        ow(actorId, ow.string);
        const actorClient = new ActorClient({
            id: actorId,
            ...this._options(),
        });

        const nestedOpts = actorClient._subResourceOptions({ id }); // eslint-disable-line no-underscore-dangle
        return new BuildClient(nestedOpts);
    }

    datasets() {

    }

    dataset() {

    }

    keyValueStores() {

    }

    keyValueStore() {

    }

    log() {

    }

    requestQueues() {

    }

    requestQueue() {

    }

    // TODO requires new endpoint
    // runs() {
    //
    // }

    // TODO temporarily uses second parameter + nested client
    run(id, actorId) {
        ow(id, ow.string);
        ow(actorId, ow.string);
        const actorClient = new ActorClient({
            id: actorId,
            ...this._options(),
        });

        const nestedOpts = actorClient._subResourceOptions({ id }); // eslint-disable-line no-underscore-dangle
        return new RunClient(nestedOpts);
    }
}

module.exports = ApifyClient;
