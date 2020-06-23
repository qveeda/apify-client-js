const ow = require('ow');
const ResourceCollectionClient = require('../base/resource_collection_client');

class RunCollectionClient extends ResourceCollectionClient {
    /**
     * @param {ApiClientOptions} options
     */
    constructor(options) {
        super({
            resourcePath: 'runs',
            disableMethods: ['create', 'getOrCreate'],
            ...options,
        });
    }

    async list(options = {}) {
        ow(options, ow.object.exactShape({
            limit: ow.optional.number,
            offset: ow.optional.number,
            desc: ow.optional.boolean,
        }));
        return super.list(options);
    }
}

module.exports = RunCollectionClient;
