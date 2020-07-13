const http = require('http');
const got = require('got');

const port = 3030, host = '127.0.0.1';
const vRef = 230; // Volt

const measureDeviceHost = 'http://192.168.178.62/current?adc=';
const channels = {
    0: {
        name: 'Treppenhaus Keller',
        offset: -14
    },
    1: {
        name: 'L1',
        offset: -14
    },
    2: {
        name: 'Heizung',
        offset: -14
    },
    3: {
        name: 'L3',
        offset: -14
    },
    4: {
        name: 'L2',
        offset: -14
    },
    5: {
        name: 'Server + WAN',
        offset: -14
    }
};

const server = http.createServer(async function (request, response) {
    const lines = [];
    lines.push('# HELP nrg_current_measure_raw The current * 1000 in A of a certain channel');
    lines.push('# TYPE nrg_current_measure_raw gauge');
    lines.push('# HELP nrg_power_measure The power in Watt of a certain channel');
    lines.push('# TYPE nrg_power_measure gauge');

    try {
        for (const [channel, cfg] of Object.entries(channels)) {
            const response = await got(measureDeviceHost + channel).json();
            lines.push(`nrg_current_measure_raw{ channel = "${channel}", name = "${cfg.name}" } ${(response.return_value).toFixed(4)}`);
            lines.push(`nrg_power_measure{ channel = "${channel}", name = "${cfg.name}" } ${(response.return_value * (vRef / 1000) + cfg.offset).toFixed(4)}`);
        }
    } catch (e) {
        console.log(e);
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(lines.join('\n'))
})

server.listen(port, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `Server is running at http://${host}:${port}`);
});