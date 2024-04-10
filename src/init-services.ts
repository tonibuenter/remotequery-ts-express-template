/* tslint:disable:no-console */
import { RemoteQuery, Result } from 'remotequery-ts';

export function initServices(rq: RemoteQuery): void {
  rq.registerNode('node1_address', async (): Promise<Result> => {
    return {
      header: ['firstName', 'lastName'],
      table: [
        ['sebastian', 'meier'],
        ['alfred', 'heim']
      ]
    };
  });
}
