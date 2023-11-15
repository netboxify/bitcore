import { BaseModule } from '..';
import { DASHStateProvider } from '../../providers/chain-state/dash/dash';
import { VerificationPeer } from '../bitcoin/VerificationPeer';
import { DashP2PWorker } from './p2p';

export default class DASHModule extends BaseModule {
  constructor(services) {
    super(services);
    services.Libs.register('DASH', '@dashevo/dashcore-lib', '@dashevo/dashcore-p2p'); // 'bitcore-lib', '@dashevo/dashcore-p2p' /*'bitcore-p2p'*/);
    services.P2P.register('DASH', DashP2PWorker);
    services.CSP.registerService('DASH', new DASHStateProvider());
    services.Verification.register('DASH', VerificationPeer);
  }
}
