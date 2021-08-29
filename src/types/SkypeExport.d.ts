export interface SkypeExport {
  userId: string;
  exportDate: string | Date;
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  displayName: string | null;
  version: number;
  properties: ConversationProperties;
  threadProperties: any;
  MessageList: Message[];
}

export interface ConversationProperties {
  conversationblocked: boolean;
  lastimreceivedtime: string | Date;
  consumptionhorizon: string;
  conversationstatus: string;
}

export interface Message {
  id: string;
  displayName: string | null;
  originalarrivaltime: string | Date;
  messagetype: string;
  version: number;
  content: string;
  conversationid: string;
  from: string;
  properties: any | null;
  amsreferences: any | null;
}

export interface Partlist {
  type: string | null;
  alt: string | null;
  callId: string | null;
  part: Part[] | null;
}

export interface Part {
  identity: string | null;
  name: string | null;
  duration: string | null | undefined;
}

export interface Quote {
  author: string | null
  authorname: string | null
  timestamp: string | null
  conversation: string | null
  messageid: string | null
  cuid: string | null
  legacyquote: LegacyQuote[]
  content: string | null
}

export interface LegacyQuote {
  content: string | null
}

export interface EM {
  a: string | null
  ts_ms: string | null
  ts: string | null
  t: string | null
}
