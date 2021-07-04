// dependencies

// app scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'kjkjsadfsdkjasd',
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'sdjhfskdjhfksjd',
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
}

// determine which env was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export targeted environment
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;