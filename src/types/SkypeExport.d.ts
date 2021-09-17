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
  // other
  parsed: Boolean;
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
  properties: MessageProperties | null;
  amsreferences: string[] | null;
  // in case of an Event/Call
  partlist: Partlist | undefined;
  // in case of a text Message
  quote: Quote | undefined;
  em: EM | undefined;
  // others
  parsed: boolean | undefined;
}

export interface MessageProperties {
  edittime: string | undefined
  deletetime: string | undefined
  isserversidegenerated: string | undefined
  albumId: string | undefined
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
