import { checkParamOrThrow, parseDateFields, pluckData } from './utils';
import Resource from './resource';

/**
 * Logs
 * The API endpoints described in this section are used the download the logs generated by actor builds and runs.
 * Note that only the trailing 5M characters of the log are stored, the rest is discarded.
 *
 * Note that the endpoints do not require the authentication token, the calls are authenticated using a hard-to-guess ID of the actor build or run.
 *
 * For more details see the [Logs endpoint](https://docs.apify.com/api/v2#/reference/logs)
 *
 * @memberOf ApifyClient
 * @namespace logs
 */
export default class Log extends Resource {
    constructor(httpClient) {
        super(httpClient, '/v2/logs');
    }

    /**
     * Returns the log text.
     * Note that it does not support streaming.
     *
     * For more details see  [get log endpoint](https://docs.apify.com/api/v2#/reference/logs/log/get-log)
     *
     * @memberof ApifyClient.logs
     * @param {Object} options
     * @param {String} options.logId - ID of the log which is either ID of the act build or ID of the act run.
     * @returns {Promise.<string>|null}
     */
    // TODO: Streaming
    async getLog(options = {}) {
        const { logId } = options;

        checkParamOrThrow(logId, 'logId', 'String');

        const endpointOptions = {
            url: `/${logId}`,
            method: 'GET',
            headers: {
                'content-type': null,
            },
            json: false,
        };

        return this._call(options, endpointOptions);
    }
}
