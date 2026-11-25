export const QUOTE_ROOMS_KEY = 'zj-client-quote-rooms-v1';

export function readQuoteRooms(clientId = null) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(QUOTE_ROOMS_KEY));
    const rooms = Array.isArray(saved) ? saved.filter((room) => room && typeof room === 'object' && room.quote) : [];
    return clientId ? rooms.filter((room) => room.clientId === clientId) : rooms;
  } catch {
    return [];
  }
}

function writeQuoteRooms(rooms) {
  try {
    window.localStorage.setItem(QUOTE_ROOMS_KEY, JSON.stringify(rooms.slice(0, 200)));
    return true;
  } catch {
    return false;
  }
}

export function publishQuoteRoom({ client, quote, employee }) {
  if (!client?.id || !quote?.snapshotId || !quote?.quote) return { error: 'invalid' };
  const rooms = readQuoteRooms();
  const existing = rooms.find((room) => room.clientId === client.id && room.quoteSnapshotId === quote.snapshotId);
  if (existing) return { room: existing, existing: true };
  const now = new Date().toISOString();
  const room = {
    id: `quote-room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    clientId: client.id,
    client: { name: client.name, company: client.company, email: client.email },
    quoteSnapshotId: quote.snapshotId,
    quoteId: quote.id,
    version: quote.version,
    quote: structuredClone(quote.quote),
    status: 'Awaiting client',
    sharedAt: now,
    sharedBy: employee?.name || 'Sales demo user',
    decision: null,
    history: [{ at: now, type: 'shared', by: employee?.name || 'Sales demo user', text: `Version ${quote.version} shared to the client quote room.` }]
  };
  const next = rooms.map((current) => {
    if (current.clientId !== client.id || current.quoteId !== quote.id || current.version >= quote.version || current.status === 'Accepted' || current.status === 'Superseded') return current;
    return {
      ...current,
      status: 'Superseded',
      supersededBy: room.id,
      history: [...(current.history || []), { at: now, type: 'superseded', by: employee?.name || 'Sales demo user', text: `Superseded by version ${quote.version}; the original snapshot remains preserved.` }]
    };
  });
  next.unshift(room);
  return writeQuoteRooms(next) ? { room, existing: false } : { error: 'storage' };
}

export function updateQuoteRoom(id, updater) {
  const rooms = readQuoteRooms();
  const index = rooms.findIndex((room) => room.id === id);
  if (index < 0) return null;
  rooms[index] = { ...rooms[index], ...updater(rooms[index]) };
  return writeQuoteRooms(rooms) ? rooms[index] : null;
}

export function recordClientQuoteDecision(roomId, type, note, client) {
  const room = readQuoteRooms().find((item) => item.id === roomId);
  if (!room || room.status !== 'Awaiting client' || client?.id !== room.clientId) return { error: 'locked' };
  const cleanNote = String(note || '').trim().slice(0, 2000);
  if (type === 'revision' && !cleanNote) return { error: 'note' };
  if (!['accepted', 'revision'].includes(type)) return { error: 'invalid' };
  const now = new Date().toISOString();
  const status = type === 'accepted' ? 'Accepted' : 'Revision requested';
  const by = client?.name || room.client.name || 'Client demo user';
  return updateQuoteRoom(roomId, (current) => ({
    status,
    decision: { type, note: cleanNote, at: now, by },
    history: [...(current.history || []), { at: now, type, by, text: type === 'accepted' ? `Accepted version ${current.version}.` : `Requested changes to version ${current.version}: ${cleanNote}` }]
  }));
}
