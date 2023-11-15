import { EventEmitter } from 'events';
import { BitcoinBlock, BitcoinBlockStorage } from '../../models/block';
import { Libs } from '../../providers/libs';
import { BitcoinP2PWorker } from '../bitcoin/p2p';

export class DashP2PWorker extends BitcoinP2PWorker {
  protected bitcoreLib: any;
  protected bitcoreP2p: any;
  protected chainConfig: any;
  protected messages: any;
  protected connectInterval?: NodeJS.Timer;
  protected invCache: any;
  protected invCacheLimits: any;
  protected initialSyncComplete: boolean;
  protected blockModel: BitcoinBlock;
  protected pool: any;
  public events: EventEmitter;
  public isSyncing: boolean;
  constructor({ chain, network, chainConfig, blockModel = BitcoinBlockStorage }) {
    super({ chain, network, chainConfig, blockModel });
    this.blockModel = blockModel;
    this.chain = chain;
    this.network = network;
    this.bitcoreLib = Libs.get(this.chain).lib;
    this.bitcoreP2p = Libs.get(this.chain).p2p;
    this.chainConfig = chainConfig;
    this.events = new EventEmitter();
    this.isSyncing = false;
    this.initialSyncComplete = false;
    this.invCache = {};
    this.invCacheLimits = {
      [this.bitcoreP2p.Inventory.TYPE.BLOCK]: 100,
      [this.bitcoreP2p.Inventory.TYPE.TX]: 100000
    };

    if (this.network === 'regtest') {
      this.bitcoreLib.Networks.enableRegtest();
    }

    this.messages = new this.bitcoreP2p.Messages({
      protocolVersion: 70215,
      network: this.bitcoreLib.Networks.get(this.network),
      Block: this.bitcoreLib.Block,
      Transaction: this.bitcoreLib.Transaction,
      BlockHeader: this.bitcoreLib.BlockHeader
    });

    this.pool = new this.bitcoreP2p.Pool({
      addrs: this.chainConfig.trustedPeers.map(peer => {
        return {
          ip: {
            v4: peer.host
          },
          port: peer.port
        };
      }),
      dnsSeed: false,
      listenAddr: false,
      network: this.network,
      messages: this.messages
    });
  }
}
