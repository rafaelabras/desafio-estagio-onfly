"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
class Random {
    constructor() {
        this.description = {
            displayName: 'Random',
            name: 'random',
            icon: 'file:Random.svg',
            group: ['transform'],
            version: 1,
            description: 'Gerador de números aleatórios usando o random.org',
            defaults: {
                name: 'Random',
                color: '#7744DD'
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [{
                            name: 'True Random Number Generator',
                            value: 'generator',
                            description: 'Gera um número aleatório usando Random.org',
                        }
                    ],
                    default: 'generator'
                },
                {
                    displayName: 'Min',
                    name: 'min',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['generator']
                        }
                    },
                    default: 1,
                    description: 'Valor minimo',
                    required: true
                },
                {
                    displayName: 'Max',
                    name: 'max',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['generator']
                        }
                    },
                    default: 60,
                    description: 'Valor máximo',
                    required: true
                }
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        if (operation == 'generator') {
            const min = this.getNodeParameter('min', 0);
            const max = this.getNodeParameter('max', 0);
            const options = {
                method: 'GET',
                url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
            };
            try {
                const response = await this.helpers.request(options);
                const randomNumber = parseInt(response.trim());
                returnData.push({
                    json: {
                        randomNumber,
                        min,
                        max,
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                    });
                }
                else {
                    throw error;
                }
            }
        }
        return [returnData];
    }
}
exports.Random = Random;
