
export interface SkypeContentOptions {
  partlist: Partlist | undefined
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
