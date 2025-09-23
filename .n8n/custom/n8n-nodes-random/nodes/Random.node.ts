import {
	IExecuteFunctions,
} from 'n8n-workflow';

import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        icon: 'file:Random.svg',
        group: [],
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
	
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const operation = this.getNodeParameter('operation', 0) as string;


        if (operation == 'generator'){
        const min = this.getNodeParameter('min', 0) as number;
        const max = this.getNodeParameter('max', 0) as number;   
        
        const options = {
            method: 'GET' as const,
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
    } catch (error) {
        if (this.continueOnFail()) {
            returnData.push({
                json: { error: (error as Error).message },
            });
        } else {
            throw error;
        }
    }
}
    return [returnData];
    
}
}