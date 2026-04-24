import { useState, useEffect, useCallback } from 'react';
import { auctions as auctionsApi, bids as bidsApi } from '../controllers/endpoints';
import type { Auction as BackendAuction } from '../interfaces/Auction';
import { AuctionStatus } from '../interfaces/Auction';
import type { Bid } from '../interfaces/Bid';
import { authModel } from '../models/authModel';
import { getStompClient } from '../lib/wsClient';

export type DisplayStatus = 'leading' | 'outbid' | 'open' | 'pending' | 'won' | 'lost';

export interface DisplayAuction {
  id: number;
  slot: string;
  slotDate: string;
  slotDateIso: string;
  region: string;
  auctionEnd: string;
  auctionStart: string;
  currentBid: number;
  myBid: number | null;
  status: DisplayStatus;
  startPrice: number;
  whaleOnly: boolean;
}

function fmtHour(iso: string): string {
  const d = new Date(iso + 'Z');
  const h = d.getHours();
  const min = d.getMinutes();
  return `${h}h${min > 0 ? String(min).padStart(2, '0') : ''}`;
}

function buildDisplay(
  a: BackendAuction,
  highest: Bid | null | undefined,
  myBidMap: Map<number, Bid>,
  userId: number | undefined,
): DisplayAuction {
  const now = Date.now();
  const startMs = a.startTime ? new Date(a.startTime + 'Z').getTime() : now;
  const endMs   = a.endTime   ? new Date(a.endTime   + 'Z').getTime() : now;
  const notStarted = startMs > now;
  const finished   = endMs <= now || a.status === AuctionStatus.CLOSED;

  const currentBid = highest?.amount ?? a.startPrice ?? 0;
  const myBidEntry = myBidMap.get(a.id);
  const myBid      = myBidEntry?.amount ?? null;
  const isLeading  = !!highest && highest.storeId === userId;

  const slot = a.slotStartTime && a.slotEndTime
    ? `${fmtHour(a.slotStartTime)}–${fmtHour(a.slotEndTime)}`
    : a.startTime && a.endTime
    ? `${fmtHour(a.startTime)}–${fmtHour(a.endTime)}`
    : '—';

  const slotDate = a.slotStartTime
    ? new Date(a.slotStartTime + 'Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : '';

  const slotDateIso = a.slotStartTime ? a.slotStartTime.split('T')[0] : '';

  let status: DisplayStatus;
  if (finished && !notStarted) {
    status = isLeading ? 'won' : 'lost';
  } else if (isLeading) {
    status = 'leading';
  } else if (notStarted) {
    status = 'pending';
  } else if (myBid !== null) {
    status = 'outbid';
  } else {
    status = 'open';
  }

  return {
    id: a.id,
    slot,
    slotDate,
    slotDateIso,
    region: a.region ?? '',
    auctionEnd:   a.endTime   ?? '',
    auctionStart: a.startTime ?? '',
    currentBid,
    myBid,
    status,
    startPrice: a.startPrice ?? 0,
    whaleOnly: a.whaleOnly ?? false,
  };
}

export function useAuctions() {
  const user = authModel.getUser();

  const [auctionList,  setAuctionList]  = useState<BackendAuction[]>([]);
  const [highestBids,  setHighestBids]  = useState<Map<number, Bid | null>>(new Map());
  const [myBids,       setMyBids]       = useState<Map<number, Bid>>(new Map());
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const loadInitial = useCallback(async () => {
    try {
      const list = await auctionsApi.all();

      const [highestEntries, myBidsMap] = await Promise.all([
        Promise.all(
          list.map(async (a): Promise<[number, Bid | null]> => {
            try {
              return [a.id, await auctionsApi.highestBid(a.id)];
            } catch {
              return [a.id, null];
            }
          }),
        ).then(entries => new Map(entries)),

        user?.id
          ? bidsApi.byStore(user.id).then(myBidsArr => {
              const map = new Map<number, Bid>();
              for (const b of myBidsArr) {
                const prev = map.get(b.auctionId);
                if (!prev || b.amount > prev.amount) map.set(b.auctionId, b);
              }
              return map;
            })
          : Promise.resolve(new Map<number, Bid>()),
      ]);

      setAuctionList(list);
      setHighestBids(highestEntries);
      setMyBids(myBidsMap);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // WebSocket subscriptions
  useEffect(() => {
    const client = getStompClient();
    const subs: { unsubscribe(): void }[] = [];

    const subscribe = () => {
      // Full auction list update (scheduler transitions + new auction created)
      subs.push(
        client.subscribe('/topic/auctions', msg => {
          const updated = JSON.parse(msg.body) as BackendAuction[];
          setAuctionList(updated);
        }),
      );

      // New bid on any auction
      subs.push(
        client.subscribe('/topic/bids', msg => {
          const bid = JSON.parse(msg.body) as Bid;
          setHighestBids(prev => {
            const prevHighest = prev.get(bid.auctionId);
            if (user?.id && prevHighest?.storeId === user.id && bid.storeId !== user.id) {
              window.dispatchEvent(new CustomEvent('auction-outbid', {
                detail: { auctionId: bid.auctionId, newAmount: bid.amount },
              }));
            }
            return new Map(prev).set(bid.auctionId, bid);
          });
          if (bid.storeId === user?.id) {
            setMyBids(prev => {
              const next = new Map(prev);
              const existing = next.get(bid.auctionId);
              if (!existing || bid.amount > existing.amount) next.set(bid.auctionId, bid);
              return next;
            });
          }
        }),
      );

      // My balance updated (I bid or got outbid)
      if (user?.id) {
        subs.push(
          client.subscribe(`/queue/store/${user.id}/balance`, msg => {
            const data = JSON.parse(msg.body) as { balance: number; reservedBalance: number };
            const currentUser = authModel.getUser();
            if (currentUser) {
              const updated = { ...currentUser, ...data };
              authModel.saveUser(updated);
              window.dispatchEvent(new Event('user-updated'));
            }
          }),
        );
      }
    };

    if (client.connected) {
      subscribe();
    } else {
      const prevOnConnect = client.onConnect;
      client.onConnect = frame => {
        prevOnConnect?.call(client, frame);
        subscribe();
      };
    }

    return () => {
      subs.forEach(s => s.unsubscribe());
    };
  }, [user?.id]);

  const auctions = auctionList.map(a =>
    buildDisplay(a, highestBids.get(a.id), myBids, user?.id),
  );

  return { auctions, loading, error, reload: loadInitial };
}
