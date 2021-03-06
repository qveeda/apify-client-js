const ResourceClient = require('../base/resource_client');
const {
    pluckData,
    parseDateFields,
} = require('../utils');
const {
    waitForFinish,
} = require('./shared_methods/wait_for_finish');

class BuildClient extends ResourceClient {
    /**
     * @param {ApiClientOptions} options
     */
    constructor(options) {
        super({
            resourcePath: 'builds',
            ...options,
        });
        this._waitForFinish = waitForFinish;
    }

    async abort() {
        const response = await this.httpClient.call({
            url: this._url('abort'),
            method: 'POST',
            params: this._params(),
        });

        return parseDateFields(pluckData(response.data));
    }

    /**
     * Returns a promise that resolves with the finished Build object when the provided actor build finishes
     * or with the unfinished Build object when the `waitSecs` timeout lapses. The promise is NOT rejected
     * based on run status. You can inspect the `status` property of the Build object to find out its status.
     *
     * This is useful when you need to immediately start a run after a build finishes.
     *
     * @param {object} [options]
     * @param {string} [options.waitSecs]
     *  Maximum time to wait for the build to finish, in seconds.
     *  If the limit is reached, the returned promise is resolved to a build object that will have
     *  status `READY` or `RUNNING`. If `waitSecs` omitted, the function waits indefinitely.
     * @returns {Promise<Object>}
     */
    async waitForFinish(options = {}) {
        return this._waitForFinish(options);
    }
}

module.exports = BuildClient;
